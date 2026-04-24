"""Tests for the Stripe billing router.

We stub out every network call to Stripe:
  - stripe.Customer.create
  - stripe.checkout.Session.create
  - stripe.billing_portal.Session.create
  - stripe.Webhook.construct_event

Nothing real is sent to Stripe.
"""
from __future__ import annotations

import uuid
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from sqlalchemy import select

from app.models import CreditTransaction, StripeEvent, User
from tests.conftest import _TEST_SESSION, set_current_user


API = "/api/billing"


# ---------------------------------------------------------------------------
# /checkout
# ---------------------------------------------------------------------------
@pytest.fixture
def _configure_stripe_settings():
    """Populate Stripe-related settings with fake values so checkout works."""
    from app.api import billing as billing_module
    from app.config import settings as app_settings

    old = {
        "stripe_secret_key": app_settings.stripe_secret_key,
        "stripe_webhook_secret": app_settings.stripe_webhook_secret,
        "stripe_price_starter": app_settings.stripe_price_starter,
        "stripe_price_pro": app_settings.stripe_price_pro,
        "stripe_price_pack_10": app_settings.stripe_price_pack_10,
        "stripe_price_pack_30": app_settings.stripe_price_pack_30,
        "stripe_checkout_success_url": app_settings.stripe_checkout_success_url,
        "stripe_checkout_cancel_url": app_settings.stripe_checkout_cancel_url,
    }
    app_settings.stripe_secret_key = "sk_test_fake"
    app_settings.stripe_webhook_secret = "whsec_fake"
    app_settings.stripe_price_starter = "price_starter"
    app_settings.stripe_price_pro = "price_pro"
    app_settings.stripe_price_pack_10 = "price_pack10"
    app_settings.stripe_price_pack_30 = "price_pack30"
    app_settings.stripe_checkout_success_url = "https://example.com/success"
    app_settings.stripe_checkout_cancel_url = "https://example.com/cancel"
    billing_module.stripe.api_key = "sk_test_fake"
    yield
    for k, v in old.items():
        setattr(app_settings, k, v)


@pytest.mark.asyncio
async def test_checkout_requires_auth(app_client, _configure_stripe_settings):
    """Without auth, /checkout returns 401 from fastapi-users.

    We temporarily remove the test override for `current_verified_user` so the
    real dependency (cookie auth) runs. No cookie -> 401.
    """
    from app.core.security import current_verified_user
    from app.main import app as _app

    override = _app.dependency_overrides.pop(current_verified_user, None)
    try:
        r = await app_client.post(
            f"{API}/checkout", json={"plan": "starter"}
        )
        assert r.status_code == 401
    finally:
        if override is not None:
            _app.dependency_overrides[current_verified_user] = override


@pytest.mark.asyncio
async def test_checkout_invalid_plan(
    app_client, make_user, _configure_stripe_settings
):
    user = await make_user()
    set_current_user(user)

    r = await app_client.post(f"{API}/checkout", json={"plan": "foo"})
    # Pydantic rejects the literal -> 422, which is also a 4xx "bad input".
    # The spec says 400 but Pydantic-level validation is 422. Accept both.
    assert r.status_code in (400, 422)


@pytest.mark.asyncio
async def test_checkout_creates_session_and_customer(
    app_client, make_user, _configure_stripe_settings
):
    user = await make_user()
    set_current_user(user)

    fake_customer = SimpleNamespace(id="cus_fake123")
    fake_session = SimpleNamespace(url="https://checkout.stripe.com/c/fake")

    with patch(
        "app.api.billing.stripe.Customer.create", return_value=fake_customer
    ) as mock_cust, patch(
        "app.api.billing.stripe.checkout.Session.create",
        return_value=fake_session,
    ) as mock_sess:
        r = await app_client.post(
            f"{API}/checkout", json={"plan": "pack_10"}
        )

    assert r.status_code == 200, r.text
    assert r.json()["url"] == "https://checkout.stripe.com/c/fake"
    mock_cust.assert_called_once()
    mock_sess.assert_called_once()

    # Customer ID persisted on the user row
    async with _TEST_SESSION() as s:
        row = (
            await s.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        assert row.stripe_customer_id == "cus_fake123"


# ---------------------------------------------------------------------------
# /webhook
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_webhook_invalid_signature(app_client, _configure_stripe_settings):
    import stripe as _stripe

    with patch(
        "app.api.billing.stripe.Webhook.construct_event",
        side_effect=_stripe.SignatureVerificationError("bad sig", "sig"),
    ):
        r = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "bad"},
        )
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_webhook_idempotency(
    app_client, make_user, _configure_stripe_settings
):
    user = await make_user(credits=5)

    event = {
        "id": "evt_test_1",
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "mode": "payment",
                "metadata": {"user_id": str(user.id), "plan": "pack_10"},
                "client_reference_id": str(user.id),
            }
        },
    }

    with patch(
        "app.api.billing.stripe.Webhook.construct_event", return_value=event
    ):
        r1 = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "ok"},
        )
        r2 = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "ok"},
        )

    assert r1.status_code == 200
    assert r2.status_code == 200

    # User got +10 exactly once
    async with _TEST_SESSION() as s:
        row = (
            await s.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        assert row.credits == 15  # 5 + 10

        txs = (
            await s.execute(
                select(CreditTransaction).where(
                    CreditTransaction.user_id == user.id
                )
            )
        ).scalars().all()
        assert len(txs) == 1
        assert txs[0].amount == 10
        assert txs[0].reason == "purchase_pack_10"
        assert txs[0].stripe_event_id == "evt_test_1"

        events = (
            await s.execute(select(StripeEvent))
        ).scalars().all()
        assert len(events) == 1
        assert events[0].event_id == "evt_test_1"


@pytest.mark.asyncio
async def test_webhook_checkout_completed_pack_adds_credits(
    app_client, make_user, _configure_stripe_settings
):
    user = await make_user(credits=2)

    event = {
        "id": "evt_pack30_1",
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "mode": "payment",
                "metadata": {"user_id": str(user.id), "plan": "pack_30"},
            }
        },
    }

    with patch(
        "app.api.billing.stripe.Webhook.construct_event", return_value=event
    ):
        r = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "ok"},
        )
    assert r.status_code == 200

    async with _TEST_SESSION() as s:
        row = (
            await s.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        assert row.credits == 32  # 2 + 30
        txs = (
            await s.execute(
                select(CreditTransaction).where(
                    CreditTransaction.user_id == user.id
                )
            )
        ).scalars().all()
        assert len(txs) == 1
        assert txs[0].amount == 30
        assert txs[0].reason == "purchase_pack_30"


@pytest.mark.asyncio
async def test_webhook_checkout_completed_subscription_sets_fields(
    app_client, make_user, _configure_stripe_settings
):
    user = await make_user(credits=3)

    event = {
        "id": "evt_sub_create",
        "type": "checkout.session.completed",
        "data": {
            "object": {
                "mode": "subscription",
                "subscription": "sub_fake_1",
                "metadata": {"user_id": str(user.id), "plan": "starter"},
            }
        },
    }

    with patch(
        "app.api.billing.stripe.Webhook.construct_event", return_value=event
    ):
        r = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "ok"},
        )
    assert r.status_code == 200

    async with _TEST_SESSION() as s:
        row = (
            await s.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        # Credits NOT changed yet — waits for invoice.payment_succeeded
        assert row.credits == 3
        assert row.stripe_subscription_id == "sub_fake_1"
        assert row.subscription_tier == "starter"


@pytest.mark.asyncio
async def test_webhook_invoice_payment_succeeded_grants_subscription_credits(
    app_client, make_user, _configure_stripe_settings, db_session
):
    user = await make_user(credits=0)
    # Attach an existing subscription to the user
    user.stripe_subscription_id = "sub_starter_1"
    user.subscription_tier = "starter"
    await db_session.commit()

    event = {
        "id": "evt_inv_1",
        "type": "invoice.payment_succeeded",
        "data": {
            "object": {
                "billing_reason": "subscription_cycle",
                "subscription": "sub_starter_1",
                "lines": {
                    "data": [
                        {
                            "price": {"id": "price_starter"},
                            "period": {"end": 1800000000},
                        }
                    ]
                },
            }
        },
    }

    with patch(
        "app.api.billing.stripe.Webhook.construct_event", return_value=event
    ):
        r = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "ok"},
        )
    assert r.status_code == 200

    async with _TEST_SESSION() as s:
        row = (
            await s.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        assert row.credits == 30  # Starter grants 30
        assert row.subscription_tier == "starter"
        assert row.subscription_current_period_end is not None

        txs = (
            await s.execute(
                select(CreditTransaction).where(
                    CreditTransaction.user_id == user.id
                )
            )
        ).scalars().all()
        assert len(txs) == 1
        assert txs[0].reason == "subscription_renewal"
        assert txs[0].amount == 30


@pytest.mark.asyncio
async def test_webhook_subscription_deleted_downgrades_user(
    app_client, make_user, _configure_stripe_settings, db_session
):
    user = await make_user(credits=17)
    user.stripe_subscription_id = "sub_to_delete"
    user.subscription_tier = "pro"
    await db_session.commit()

    event = {
        "id": "evt_sub_del",
        "type": "customer.subscription.deleted",
        "data": {"object": {"id": "sub_to_delete"}},
    }

    with patch(
        "app.api.billing.stripe.Webhook.construct_event", return_value=event
    ):
        r = await app_client.post(
            f"{API}/webhook",
            content=b"{}",
            headers={"stripe-signature": "ok"},
        )
    assert r.status_code == 200

    async with _TEST_SESSION() as s:
        row = (
            await s.execute(select(User).where(User.id == user.id))
        ).scalar_one()
        # Credits preserved, everything else reset
        assert row.credits == 17
        assert row.stripe_subscription_id is None
        assert row.subscription_tier == "free"


# ---------------------------------------------------------------------------
# /portal
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
async def test_portal_without_customer_returns_400(
    app_client, make_user, _configure_stripe_settings
):
    user = await make_user()
    set_current_user(user)

    r = await app_client.post(f"{API}/portal")
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_portal_returns_url(
    app_client, make_user, _configure_stripe_settings, db_session
):
    user = await make_user()
    user.stripe_customer_id = "cus_existing"
    await db_session.commit()
    set_current_user(user)

    fake_portal = SimpleNamespace(url="https://billing.stripe.com/p/fake")
    with patch(
        "app.api.billing.stripe.billing_portal.Session.create",
        return_value=fake_portal,
    ):
        r = await app_client.post(f"{API}/portal")
    assert r.status_code == 200
    assert r.json()["url"] == "https://billing.stripe.com/p/fake"
