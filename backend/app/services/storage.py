import asyncio
import logging
from pathlib import Path
from typing import Protocol

from app.config import settings

logger = logging.getLogger(__name__)


class StorageBackend(Protocol):
    async def put(self, key: str, data: bytes) -> None: ...
    async def get(self, key: str) -> bytes: ...
    async def delete(self, key: str) -> None: ...
    async def presigned_get_url(self, key: str, expires: int = 3600) -> str | None: ...


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

    async def presigned_get_url(self, key: str, expires: int = 3600) -> str | None:
        return None


class S3Storage:
    """S3-compatible storage (AWS S3, Cloudflare R2, MinIO, etc.)."""

    def __init__(
        self,
        bucket: str,
        endpoint_url: str,
        access_key: str,
        secret_key: str,
        region: str = "auto",
    ):
        import boto3
        from botocore.config import Config

        self.bucket = bucket
        self.client = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region,
            config=Config(signature_version="s3v4"),
        )

    async def put(self, key: str, data: bytes) -> None:
        await asyncio.to_thread(
            self.client.put_object, Bucket=self.bucket, Key=key, Body=data
        )

    async def get(self, key: str) -> bytes:
        try:
            response = await asyncio.to_thread(
                self.client.get_object, Bucket=self.bucket, Key=key
            )
            return response["Body"].read()
        except self.client.exceptions.NoSuchKey:
            raise FileNotFoundError(f"File not found: {key}")
        except Exception as e:
            if "NoSuchKey" in str(e) or "404" in str(e):
                raise FileNotFoundError(f"File not found: {key}")
            raise

    async def delete(self, key: str) -> None:
        await asyncio.to_thread(
            self.client.delete_object, Bucket=self.bucket, Key=key
        )

    async def presigned_get_url(self, key: str, expires: int = 3600) -> str | None:
        try:
            return await asyncio.to_thread(
                self.client.generate_presigned_url,
                "get_object",
                Params={"Bucket": self.bucket, "Key": key},
                ExpiresIn=expires,
            )
        except Exception:
            logger.exception("Failed to generate presigned URL for %s", key)
            return None


_storage_instance: StorageBackend | None = None


def get_storage() -> StorageBackend:
    global _storage_instance
    if _storage_instance is not None:
        return _storage_instance

    if settings.storage_backend == "s3":
        _storage_instance = S3Storage(
            bucket=settings.s3_bucket,
            endpoint_url=settings.s3_endpoint_url,
            access_key=settings.s3_access_key,
            secret_key=settings.s3_secret_key,
            region=settings.s3_region,
        )
    else:
        _storage_instance = LocalStorage()

    return _storage_instance
