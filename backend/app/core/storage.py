import boto3
from botocore.client import Config
from .config import settings


def _get_s3_client():
    if not settings.MINIO_ENDPOINT:
        return None
    return boto3.client(
        "s3",
        endpoint_url=settings.MINIO_ENDPOINT,
        aws_access_key_id=settings.MINIO_ACCESS_KEY,
        aws_secret_access_key=settings.MINIO_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name="us-east-1",
    )


def upload_file(content: bytes, file_path: str, content_type: str) -> str:
    """Upload bytes to MinIO (if configured) or fall back to Supabase Storage."""
    s3 = _get_s3_client()
    if s3:
        s3.put_object(
            Bucket=settings.MINIO_BUCKET,
            Key=file_path,
            Body=content,
            ContentType=content_type,
        )
        return f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{file_path}"

    # Supabase Storage fallback
    from .supabase import get_supabase_client
    sb = get_supabase_client()
    sb.storage.from_(settings.MINIO_BUCKET).upload(
        path=file_path,
        file=content,
        file_options={"content-type": content_type},
    )
    return sb.storage.from_(settings.MINIO_BUCKET).get_public_url(file_path)
