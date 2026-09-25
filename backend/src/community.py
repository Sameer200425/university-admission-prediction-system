from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from typing import Any, AsyncIterator, Dict, List, Optional
from sqlmodel import Session, select

from .db import CommunityPost, engine, serialize_post

_subscribers: List[asyncio.Queue] = []
_subscribers_lock = asyncio.Lock()


def list_posts(*, limit: int = 50) -> List[Dict[str, Any]]:
    limit = max(1, min(int(limit), 200))
    with Session(engine) as session:
        query = select(CommunityPost).order_by(CommunityPost.created_at.desc()).limit(limit)
        posts = session.exec(query).all()
    return [serialize_post(post) for post in posts]


def create_post(*, author: str, content: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    post = CommunityPost(
        user_id=user_id,
        author=(author or "Anonymous").strip()[:60] or "Anonymous",
        content=(content or "").strip()[:2000],
        created_at=datetime.now(timezone.utc),
    )
    with Session(engine) as session:
        session.add(post)
        session.commit()
        session.refresh(post)

    return serialize_post(post)


async def broadcast_post(post: Dict[str, Any]) -> None:
    async with _subscribers_lock:
        for q in list(_subscribers):
            try:
                q.put_nowait(post)
            except Exception:
                # If a subscriber queue is broken/full, ignore it.
                pass


async def stream_posts(*, heartbeat_seconds: int = 15) -> AsyncIterator[str]:
    queue: asyncio.Queue = asyncio.Queue(maxsize=50)
    async with _subscribers_lock:
        _subscribers.append(queue)

    try:
        # Initial event so clients know the connection is alive.
        yield "event: ready\ndata: {}\n\n"

        while True:
            try:
                post = await asyncio.wait_for(queue.get(), timeout=heartbeat_seconds)
                payload = json.dumps(post, ensure_ascii=False)
                yield f"event: post\ndata: {payload}\n\n"
            except asyncio.TimeoutError:
                # Comment line keeps the connection alive.
                yield ": ping\n\n"
    finally:
        async with _subscribers_lock:
            if queue in _subscribers:
                _subscribers.remove(queue)
