"""Stripe billing API.

Endpoints:
  - POST /billing/checkout  -> create a Checkout Session (subscription or one-time)
  - POST /billing/portal    -> redirect to Stripe Customer Portal
  - POST /billing/webhook   -> receive Stripe events (CSRF-exempt, no auth)

Credit model: each successful payment ADDS credits to user.credits.
Unused credits are never removed, even after cancellation.
"""
from __future__ import annotations

import logging
from typing import Any, Literal

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.limiter import limiter
from app.core.security import current_verified_user
from app.database import get_db
from app.models import CreditTransaction, StripeEvent, User

logger = logging.getLogger(__name__)


def _sget(obj: Any, key: str, default: Any = None) -> Any:
    """Safe key access that works on both plain dicts and Stripe objects.

    stripe-python v15 StripeObject no longer exposes dict.get() reliably
    (attribute-style __getattr__ intercepts it and raises), so calling
    `session.get("mode")` blows up with KeyError: 'get'. Using __getitem__
    with a try/except matches the classic `.get()` semantics and works
    uniformly across dicts, StripeObject, and anything else that
    implements __getitem__.
    """
    try:
        value = obj[key]
    except (KeyError, TypeError):
        return default
    return default if value is None else value

# Initialize the Stripe SDK. Safe to assign even when empty; any actual call
# will then fail with AuthenticationError which we surface as a 500.
if settings.stripe_secret_key:
    stripe.api_key = settings.stripe_secret_key


router = APIRouter(prefix="/billing", tags=["billing"])


# ---------------------------------------------------------------------------
# Plan configuration
# ---------------------------------------------------------------------------
# Plans by key -> (mode, credits_granted_on_payment, price_id_setting_attr)
# For subscriptions, the credits column is what we grant on each successful
# invoice (both subscription_create and subscription_cycle).
# For one-time packs, the credits column is granted at checkout completion.
_PLANS: dict[str, dict[str, Any]] = {
    "starter": {
        "mode": "subscription",
        "credits": 20,
        "price_attr": "stripe_price_starter",
    },
    "pro": {
        "mode": "subscription",
        "credits": 50,
        "price_attr": "stripe_price_pro",
    },
    "pack_10": {
        "mode": "payment",
        "credits": 10,
        "price_attr": "stripe_price_pack_10",
    },
    "pack_30": {
        "mode": "payment",
        "credits": 30,
        "price_attr": "stripe_price_pack_30",
    },
}


def _plan_for_price_id(price_id: str | None) -> str | None:
    """Reverse-lookup: given a Stripe price ID, return our plan key."""
    if not price_id:
        return None
    for plan_key, cfg in _PLANS.items():
        if getattr(settings, cfg["price_attr"], "") == price_id:
            return plan_key
    return None


def _ensure_stripe_configured() -> None:
    if not settings.stripe_secret_key:
        raise HTTPException(
            500,
            "Stripe n'est pas configuré sur cette instance.",
        )


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class CheckoutRequest(BaseModel):
    plan: Literal["starter", "pro", "pack_10", "pack_30"]


class CheckoutResponse(BaseModel):
    url: str


class PortalResponse(BaseModel):
    url: str


# ---------------------------------------------------------------------------
# Checkout
# ---------------------------------------------------------------------------
@router.post("/checkout", response_model=CheckoutResponse)
@limiter.limit("20/hour")
async def create_checkout_session(
    request: Request,
    payload: CheckoutRequest,
    user: User = Depends(current_verified_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a Stripe Checkout Session for the requested plan.

    Returns {"url": <stripe_checkout_url>}. Frontend should redirect there.
    """
    _ensure_stripe_configured()

    plan_cfg = _PLANS.get(payload.plan)
    if not plan_cfg:
        raise HTTPException(400, "Plan inconnu.")

    price_id = getattr(settings, plan_cfg["price_attr"], "")
    if not price_id:
        raise HTTPException(
            500,
            f"Price ID manquant pour le plan '{payload.plan}'.",
        )

    # Retrieve or create Stripe customer
    customer_id = user.stripe_customer_id
    if not customer_id:
        try:
            customer = stripe.Customer.create(
                email=user.email,
                metadata={"user_id": str(user.id)},
            )
        except stripe.StripeError as exc:
            logger.exception("Stripe Customer.create failed")
            raise HTTPException(500, "Erreur Stripe, réessayez plus tard.") from exc
        customer_id = customer.id
        await db.execute(
            update(User)
            .where(User.id == user.id)
            .values(stripe_customer_id=customer_id)
        )
        await db.commit()

    success_url = (
        settings.stripe_checkout_success_url
        or f"{settings.frontend_url}/dashboard/upgrade?success=true"
    )
    cancel_url = (
        settings.stripe_checkout_cancel_url
        or f"{settings.frontend_url}/dashboard/upgrade?cancel=true"
    )

    try:
        session = stripe.checkout.Session.create(
            customer=customer_id,
            mode=plan_cfg["mode"],
            line_items=[{"price": price_id, "quantity": 1}],
            client_reference_id=str(user.id),
            metadata={"user_id": str(user.id), "plan": payload.plan},
            success_url=success_url,
            cancel_url=cancel_url,
            allow_promotion_codes=True,
        )
    except stripe.StripeError as exc:
        logger.exception("Stripe checkout.Session.create failed")
        raise HTTPException(500, "Erreur Stripe, réessayez plus tard.") from exc

    return CheckoutResponse(url=session.url)


# ---------------------------------------------------------------------------
# Customer portal
# ---------------------------------------------------------------------------
@router.post("/portal", response_model=PortalResponse)
@limiter.limit("20/hour")
async def create_portal_session(
    request: Request,
    user: User = Depends(current_verified_user),
):
    """Create a Stripe Customer Portal session so users can manage their
    subscription (cancel, update payment method, view invoices)."""
    _ensure_stripe_configured()

    if not user.stripe_customer_id:
        raise HTTPException(400, "Pas d'abonnement actif.")

    return_url = (
        settings.stripe_checkout_success_url
        or f"{settings.frontend_url}/dashboard/upgrade"
    )

    try:
        portal = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url=return_url,
        )
    except stripe.StripeError as exc:
        logger.exception("Stripe billing_portal.Session.create failed")
        raise HTTPException(500, "Erreur Stripe, réessayez plus tard.") from exc

    return PortalResponse(url=portal.url)


# ---------------------------------------------------------------------------
# Webhook
# ---------------------------------------------------------------------------
@router.post("/webhook", include_in_schema=False)
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Stripe webhook endpoint.

    - No auth dep (Stripe calls us, not a browser).
    - Raw body is required for signature verification.
    - Idempotent: each event.id processed at most once.
    - Returns 400 on bad signature (Stripe stops retrying).
    - Returns 500 on processing errors (Stripe retries up to 3 days).
    """
    if not settings.stripe_webhook_secret:
        raise HTTPException(500, "Webhook secret not configured.")

    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig, settings.stripe_webhook_secret
        )
    except ValueError:
        # Invalid payload
        raise HTTPException(400, "Invalid payload")
    except stripe.SignatureVerificationError:
        raise HTTPException(400, "Invalid signature")

    event_id = event["id"]
    event_type = event["type"]

    # Idempotency check: insert the event row first. If it already exists
    # (IntegrityError on the PK), return immediately as a no-op.
    new_row = StripeEvent(event_id=event_id, type=event_type)
    db.add(new_row)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        logger.info("Stripe event %s already processed, skipping", event_id)
        return {"received": True}

    # Dispatch by event type
    try:
        if event_type == "checkout.session.completed":
            await _handle_checkout_completed(db, event)
        elif event_type == "invoice.payment_succeeded":
            await _handle_invoice_payment_succeeded(db, event)
        elif event_type == "customer.subscription.deleted":
            await _handle_subscription_deleted(db, event)
        elif event_type == "customer.subscription.updated":
            await _handle_subscription_updated(db, event)
        else:
            logger.info("Stripe event %s type=%s ignored", event_id, event_type)
    except HTTPException:
        raise
    except Exception:
        # Roll back the event-row insert so Stripe retries the event.
        logger.exception(
            "Failed to process stripe event %s (%s)", event_id, event_type
        )
        # Best-effort cleanup: delete the event row so the next retry can run.
        try:
            await db.execute(
                StripeEvent.__table__.delete().where(
                    StripeEvent.event_id == event_id
                )
            )
            await db.commit()
        except Exception:
            logger.exception("Could not clean up stripe_event row after failure")
        raise HTTPException(500, "Webhook processing failed")

    return {"received": True}


# ---------------------------------------------------------------------------
# Event handlers
# ---------------------------------------------------------------------------
def _from_ts(ts: int | None):
    if ts is None:
        return None
    from datetime import datetime, timezone

    return datetime.fromtimestamp(ts, tz=timezone.utc)


async def _add_credits_atomic(
    db: AsyncSession,
    *,
    user_id,
    amount: int,
    reason: str,
    stripe_event_id: str,
) -> bool:
    """Atomically add credits to a user and log a CreditTransaction.

    Returns True if the user was found and credits added, False otherwise.
    """
    result = await db.execute(
        update(User)
        .where(User.id == user_id)
        .values(credits=User.credits + amount)
        .returning(User.id)
    )
    if result.first() is None:
        return False

    tx = CreditTransaction(
        user_id=user_id,
        amount=amount,
        reason=reason,
        stripe_event_id=stripe_event_id,
    )
    db.add(tx)
    await db.commit()
    return True


async def _handle_checkout_completed(db: AsyncSession, event: dict) -> None:
    session = event["data"]["object"]
    event_id = event["id"]
    mode = _sget(session, "mode")
    metadata = _sget(session, "metadata") or {}
    user_id_str = _sget(metadata, "user_id") or _sget(session, "client_reference_id")
    plan = _sget(metadata, "plan")

    if not user_id_str:
        logger.warning(
            "checkout.session.completed without user_id (event=%s)", event_id
        )
        return

    import uuid as _uuid

    try:
        user_id = _uuid.UUID(user_id_str)
    except ValueError:
        logger.warning(
            "checkout.session.completed with invalid user_id=%r (event=%s)",
            user_id_str,
            event_id,
        )
        return

    plan_cfg = _PLANS.get(plan or "")

    if mode == "payment":
        # One-time pack: grant credits now.
        if not plan_cfg or plan_cfg["mode"] != "payment":
            logger.warning(
                "Unknown or mismatched plan %r on one-time checkout (event=%s)",
                plan,
                event_id,
            )
            return
        ok = await _add_credits_atomic(
            db,
            user_id=user_id,
            amount=plan_cfg["credits"],
            reason=f"purchase_{plan}",
            stripe_event_id=event_id,
        )
        if ok:
            logger.info(
                "Granted %d credits to user %s (plan=%s, event=%s)",
                plan_cfg["credits"],
                user_id,
                plan,
                event_id,
            )
        else:
            logger.warning(
                "checkout.session.completed: user %s not found (event=%s)",
                user_id,
                event_id,
            )
        return

    if mode == "subscription":
        # Subscription: record the subscription id + tier. Credit grant
        # happens through invoice.payment_succeeded (which fires on the
        # initial payment too).
        subscription_id = _sget(session, "subscription")
        if not plan_cfg or plan_cfg["mode"] != "subscription":
            logger.warning(
                "Unknown or mismatched plan %r on subscription checkout (event=%s)",
                plan,
                event_id,
            )
            return
        await db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                stripe_subscription_id=subscription_id,
                subscription_tier=plan,
            )
        )
        await db.commit()
        logger.info(
            "Subscription recorded for user %s (plan=%s, sub=%s)",
            user_id,
            plan,
            subscription_id,
        )
        return

    logger.info(
        "checkout.session.completed ignored: mode=%r (event=%s)", mode, event_id
    )


async def _handle_invoice_payment_succeeded(db: AsyncSession, event: dict) -> None:
    invoice = event["data"]["object"]
    event_id = event["id"]
    billing_reason = _sget(invoice, "billing_reason")
    if billing_reason not in ("subscription_create", "subscription_cycle"):
        logger.info(
            "invoice.payment_succeeded: billing_reason=%r ignored (event=%s)",
            billing_reason,
            event_id,
        )
        return

    subscription_id = _sget(invoice, "subscription")
    if not subscription_id:
        logger.info(
            "invoice.payment_succeeded without subscription (event=%s)", event_id
        )
        return

    # Find user by subscription id
    user_row = await db.execute(
        select(User).where(User.stripe_subscription_id == subscription_id)
    )
    user = user_row.scalar_one_or_none()
    if not user:
        logger.warning(
            "invoice.payment_succeeded: no user for subscription %s (event=%s)",
            subscription_id,
            event_id,
        )
        return

    # Determine plan from the price ID on the first line item
    lines = _sget(_sget(invoice, "lines") or {}, "data") or []
    price_id = None
    period_end_ts = None
    if lines:
        first = lines[0]
        price_obj = _sget(first, "price") or {}
        price_id = _sget(price_obj, "id") if not isinstance(price_obj, str) else price_obj
        period = _sget(first, "period") or {}
        period_end_ts = _sget(period, "end")

    plan = _plan_for_price_id(price_id)
    plan_cfg = _PLANS.get(plan or "")
    if not plan_cfg or plan_cfg["mode"] != "subscription":
        logger.warning(
            "invoice.payment_succeeded: unknown price %r (event=%s)",
            price_id,
            event_id,
        )
        return

    # Atomic credit grant + transaction log
    await _add_credits_atomic(
        db,
        user_id=user.id,
        amount=plan_cfg["credits"],
        reason="subscription_renewal",
        stripe_event_id=event_id,
    )

    # Update period end + tier (tier mostly stable, but defensive)
    updates: dict[str, Any] = {"subscription_tier": plan}
    if period_end_ts:
        updates["subscription_current_period_end"] = _from_ts(period_end_ts)
    await db.execute(update(User).where(User.id == user.id).values(**updates))
    await db.commit()
    logger.info(
        "Subscription renewed for user %s (plan=%s, +%d credits, event=%s)",
        user.id,
        plan,
        plan_cfg["credits"],
        event_id,
    )


async def _handle_subscription_deleted(db: AsyncSession, event: dict) -> None:
    sub = event["data"]["object"]
    subscription_id = _sget(sub, "id")
    if not subscription_id:
        return
    # Find user by subscription id and reset fields. Credits stay.
    await db.execute(
        update(User)
        .where(User.stripe_subscription_id == subscription_id)
        .values(
            stripe_subscription_id=None,
            subscription_tier="free",
            subscription_current_period_end=None,
        )
    )
    await db.commit()
    logger.info(
        "Subscription %s deleted; user downgraded to free (event=%s)",
        subscription_id,
        event["id"],
    )


async def _handle_subscription_updated(db: AsyncSession, event: dict) -> None:
    sub = event["data"]["object"]
    subscription_id = _sget(sub, "id")
    if not subscription_id:
        return

    # Try to extract the current price to detect plan changes.
    items = _sget(_sget(sub, "items") or {}, "data") or []
    price_id = None
    if items:
        price_obj = _sget(items[0], "price") or {}
        price_id = _sget(price_obj, "id") if not isinstance(price_obj, str) else price_obj
    plan = _plan_for_price_id(price_id)

    period_end_ts = _sget(sub, "current_period_end")
    updates: dict[str, Any] = {}
    if period_end_ts:
        updates["subscription_current_period_end"] = _from_ts(period_end_ts)
    if plan and _PLANS.get(plan, {}).get("mode") == "subscription":
        updates["subscription_tier"] = plan

    if not updates:
        return

    await db.execute(
        update(User)
        .where(User.stripe_subscription_id == subscription_id)
        .values(**updates)
    )
    await db.commit()
    logger.info(
        "Subscription %s updated (event=%s, changes=%s)",
        subscription_id,
        event["id"],
        list(updates.keys()),
    )
