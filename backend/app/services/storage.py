import logging
from pathlib import Path
from typing import Protocol

from app.config import settings

logger = logging.getLogger(__name__)


class StorageBackend(Protocol):
    async def put(self, key: str, data: bytes) -> None: ...
    async def get(self, key: str) -> bytes: ...
    async def delete(self, key: str) -> None: ...


class LocalStorage:
    """Local filesystem storage for development."""

    def __init__(self, base_dir: Path | None = None):
        self.base_dir = base_dir or settings.storage_path
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def put(self, key: str, data: bytes) -> None:
        path = self.base_dir / key
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

    async def get(self, key: str) -> bytes:
        path = self.base_dir / key
        if not path.exists():
            raise FileNotFoundError(f"File not found: {key}")
        return path.read_bytes()

    async def delete(self, key: str) -> None:
        path = self.base_dir / key
        if path.exists():
            path.unlink()


def get_storage() -> StorageBackend:
    return LocalStorage()
