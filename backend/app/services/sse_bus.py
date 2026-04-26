"""In-memory pub/sub bus for SSE streaming of generation progress.

The pipeline pushes events here, the SSE endpoint subscribes per
`generation_id` and forwards each event to the client. Designed for a
single Railway container — if we ever scale to N replicas this needs to
move to Redis Pub/Sub or similar.

Events are JSON-serialisable dicts. Common shapes pushed by the pipeline :
    {"step": "scraping_started"}
    {"step": "scraping_done", "duration_ms": 1234}
    {"step": "ai_started"}
    {"step": "ai_chunk", "text": "..."}                  # streaming tokens
    {"step": "ai_done", "duration_ms": 9876}
    {"step": "pdfs_done", "duration_ms": 432}
    {"step": "uploads_done", "duration_ms": 1100}
    {"step": "completed", "generation_id": "..."}
    {"step": "failed", "error": "..."}
"""

from __future__ import annotations

import asyncio
import logging
import uuid
from typing import AsyncIterator

logger = logging.getLogger(__name__)

# Per-generation queue. Lazily created on first publish or subscribe.
_QUEUES: dict[str, asyncio.Queue] = {}
# How long we keep a queue alive after the terminal event so a slow
# subscriber can still drain it.
_RETENTION_SECONDS = 30


def _key(generation_id: uuid.UUID | str) -> str:
    return str(generation_id)


def _get_or_create_queue(generation_id: uuid.UUID | str) -> asyncio.Queue:
    k = _key(generation_id)
    queue = _QUEUES.get(k)
    if queue is None:
        queue = asyncio.Queue(maxsize=200)
        _QUEUES[k] = queue
    return queue


async def publish(generation_id: uuid.UUID | str, event: dict) -> None:
    """Push an event to the bus. Drops oldest if the queue is full so the
    pipeline never blocks on a slow / disconnected SSE consumer."""
    queue = _get_or_create_queue(generation_id)
    try:
        queue.put_nowait(event)
    except asyncio.QueueFull:
        try:
            queue.get_nowait()
            queue.put_nowait(event)
        except Exception:
            logger.debug("SSE bus queue full and drop+put failed; event lost")


async def publish_terminal(
    generation_id: uuid.UUID | str, event: dict
) -> None:
    """Push a terminal event (completed/failed) and schedule cleanup of
    the queue after the retention window."""
    await publish(generation_id, event)
    # Sentinel so subscribers know to stop iterating.
    await publish(generation_id, {"step": "_close"})

    async def _cleanup():
        await asyncio.sleep(_RETENTION_SECONDS)
        _QUEUES.pop(_key(generation_id), None)

    asyncio.create_task(_cleanup())


async def subscribe(
    generation_id: uuid.UUID | str,
) -> AsyncIterator[dict]:
    """Yield events for this generation_id. Stops when a `_close` sentinel
    is received or after `_RETENTION_SECONDS` of inactivity."""
    queue = _get_or_create_queue(generation_id)
    while True:
        try:
            event = await asyncio.wait_for(
                queue.get(), timeout=_RETENTION_SECONDS
            )
        except asyncio.TimeoutError:
            return
        if event.get("step") == "_close":
            return
        yield event
