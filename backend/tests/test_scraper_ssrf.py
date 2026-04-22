"""Unit tests for the SSRF guard in `app.services.scraper._validate_url`.

We monkeypatch `socket.getaddrinfo` so no real DNS lookups happen.
"""
from __future__ import annotations

import socket

import pytest

from app.services import scraper as scraper_module
from app.services.scraper import _validate_url


def _fake_getaddrinfo(ip: str):
    """Build a fake getaddrinfo callable returning the given IP."""
    family = socket.AF_INET6 if ":" in ip else socket.AF_INET

    def _inner(host, port, *args, **kwargs):
        return [(family, socket.SOCK_STREAM, 6, "", (ip, 0))]

    return _inner


@pytest.mark.asyncio
async def test_valid_linkedin_public_ip(monkeypatch):
    monkeypatch.setattr(
        scraper_module.socket,
        "getaddrinfo",
        _fake_getaddrinfo("93.184.216.34"),  # example.com-ish public IP
    )
    # Must not raise.
    await _validate_url("https://www.linkedin.com/jobs/view/123")


@pytest.mark.asyncio
async def test_valid_example_http(monkeypatch):
    monkeypatch.setattr(
        scraper_module.socket,
        "getaddrinfo",
        _fake_getaddrinfo("93.184.216.34"),
    )
    await _validate_url("http://example.com/job")


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "url",
    [
        "file:///etc/passwd",
        "javascript:alert(1)",
        "ftp://foo.com/bar",
        "gopher://foo.com/",
    ],
)
async def test_invalid_scheme_rejected(monkeypatch, url):
    # Scheme check short-circuits before DNS, but stub anyway in case.
    monkeypatch.setattr(
        scraper_module.socket,
        "getaddrinfo",
        _fake_getaddrinfo("1.1.1.1"),
    )
    with pytest.raises(ValueError):
        await _validate_url(url)


@pytest.mark.asyncio
async def test_empty_hostname(monkeypatch):
    monkeypatch.setattr(
        scraper_module.socket,
        "getaddrinfo",
        _fake_getaddrinfo("1.1.1.1"),
    )
    with pytest.raises(ValueError):
        await _validate_url("http:///path")


@pytest.mark.asyncio
async def test_blank_url(monkeypatch):
    with pytest.raises(ValueError):
        await _validate_url("")
    with pytest.raises(ValueError):
        await _validate_url("   ")


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "ip",
    [
        "10.0.0.1",        # private
        "192.168.1.1",     # private
        "172.16.0.1",      # private
        "127.0.0.1",       # loopback
        "169.254.169.254",  # AWS/GCP metadata — link-local
        "::1",             # IPv6 loopback
        "fc00::1",         # IPv6 ULA (private)
        "fe80::1",         # IPv6 link-local
        "0.0.0.0",         # unspecified
        "224.0.0.1",       # multicast
    ],
)
async def test_ssrf_private_ips_rejected(monkeypatch, ip):
    monkeypatch.setattr(
        scraper_module.socket,
        "getaddrinfo",
        _fake_getaddrinfo(ip),
    )
    with pytest.raises(ValueError):
        await _validate_url("https://evil.example.com/path")


@pytest.mark.asyncio
async def test_dns_resolution_failure_rejected(monkeypatch):
    def _boom(*args, **kwargs):
        raise socket.gaierror("nxdomain")

    monkeypatch.setattr(scraper_module.socket, "getaddrinfo", _boom)
    with pytest.raises(ValueError):
        await _validate_url("https://nonexistent.example.invalid/")


@pytest.mark.asyncio
async def test_single_label_hostname_rejected(monkeypatch):
    # Hosts without a dot are refused before any DNS lookup.
    # This blocks `http://localhost/` and similar.
    with pytest.raises(ValueError):
        await _validate_url("http://localhost/admin")
