from __future__ import annotations

import json
import os
import time
from typing import Any, Dict, Optional, Tuple

try:
    import redis.asyncio as redis

    REDIS_AVAILABLE = True
except Exception:
    REDIS_AVAILABLE = False


REDIS_URL = os.getenv("REDIS_URL") or os.getenv("UAPS_REDIS_URL")


class CacheClient:
    def __init__(self) -> None:
        self._redis = None
        self._memory: Dict[str, Tuple[float, str]] = {}

    async def init(self) -> None:
        if not REDIS_AVAILABLE or not REDIS_URL:
            return
        try:
            self._redis = redis.from_url(REDIS_URL, decode_responses=True)
            await self._redis.ping()
        except Exception:
            self._redis = None

    async def get_json(self, key: str) -> Optional[Any]:
        if self._redis is not None:
            try:
                value = await self._redis.get(key)
                if value is None:
                    return None
                return json.loads(value)
            except Exception:
                return None

        now = time.time()
        item = self._memory.get(key)
        if not item:
            return None
        expires_at, value = item
        if expires_at < now:
            self._memory.pop(key, None)
            return None
        try:
            return json.loads(value)
        except Exception:
            return None

    async def set_json(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        payload = json.dumps(value)
        if self._redis is not None:
            try:
                await self._redis.setex(key, ttl_seconds, payload)
                return
            except Exception:
                pass

        expires_at = time.time() + ttl_seconds
        self._memory[key] = (expires_at, payload)


cache_client = CacheClient()


async def init_cache() -> None:
    await cache_client.init()


def cache_key(prefix: str, key: str) -> str:
    return f"uaps:{prefix}:{key}"
