"""
Upload UIA Guidebook WebP images to Supabase Storage and link them to projects.

Usage:
    python scripts/upload_guidebook_images.py --source-dir /path/to/converted_webp
    python scripts/upload_guidebook_images.py --source-dir /path/to/converted_webp --dry-run

Folder structure expected:
    <source-dir>/
        IFF1/   <- folder name must match project external_code exactly
            13 - IFF1.webp
            15 - IFF1.webp
        LDP6/
            ...

CRITICAL: Images are matched strictly by folder name == external_code.
          Images from one folder are NEVER assigned to a different project.
"""
import sys
import os
import argparse
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
log = logging.getLogger(__name__)

BUCKET = "project-images"


def get_supabase_client():
    from supabase import create_client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise EnvironmentError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in backend/.env"
        )
    return create_client(url, key)


def process_project_folder(
    supabase,
    folder: Path,
    dry_run: bool,
) -> tuple[int, int]:
    """
    Process a single project folder.
    Returns (images_uploaded, errors).
    """
    code = folder.name  # e.g. "IFF1"
    webp_files = sorted(folder.glob("*.webp"))

    if not webp_files:
        log.warning(f"[{code}] No .webp files found — skipping")
        return 0, 0

    # Look up project by external_code via Supabase REST
    resp = supabase.table("projects").select("id, project_name").eq("external_code", code).execute()
    rows = resp.data if resp.data else []

    if not rows:
        log.warning(f"[{code}] No project found with external_code='{code}' — skipping")
        return 0, 1

    project_id = rows[0]["id"]
    project_name = rows[0]["project_name"]
    log.info(f"[{code}] '{project_name}' | {len(webp_files)} image(s)")

    if dry_run:
        for f in webp_files:
            log.info(f"  [DRY-RUN] Would upload: {f.name} → {code}/{f.name}")
        return len(webp_files), 0

    # Upload images and collect public URLs
    uploaded_urls: list[str] = []
    errors = 0
    for f in webp_files:
        storage_path = f"{code}/{f.name}"
        try:
            with open(f, "rb") as fp:
                data = fp.read()
            supabase.storage.from_(BUCKET).upload(
                path=storage_path,
                file=data,
                file_options={"content-type": "image/webp", "upsert": "true"},
            )
            public_url = supabase.storage.from_(BUCKET).get_public_url(storage_path)
            uploaded_urls.append(public_url)
            log.info(f"  Uploaded: {storage_path}")
        except Exception as exc:
            log.error(f"  Failed to upload {f.name}: {exc}")
            errors += 1

    if not uploaded_urls:
        return 0, errors

    # Replace existing project_images rows
    supabase.table("project_images").delete().eq("project_id", project_id).execute()
    rows_to_insert = [
        {"project_id": project_id, "image_url": url, "display_order": idx}
        for idx, url in enumerate(uploaded_urls)
    ]
    supabase.table("project_images").insert(rows_to_insert).execute()

    log.info(f"  [{code}] Saved {len(uploaded_urls)} image URL(s) to DB")
    return len(uploaded_urls), errors


def main():
    parser = argparse.ArgumentParser(description="Upload Guidebook WebP images to Supabase Storage")
    parser.add_argument("--source-dir", required=True, help="Root directory containing per-project WebP folders")
    parser.add_argument("--dry-run", action="store_true", help="Print what would be uploaded without doing it")
    parser.add_argument("--only", help="Comma-separated list of folder names to process (e.g. LDP42,LDP51)")
    args = parser.parse_args()

    source = Path(args.source_dir)
    if not source.is_dir():
        log.error(f"--source-dir '{source}' is not a valid directory")
        sys.exit(1)

    only_set = set(args.only.split(",")) if args.only else None
    folders = sorted([d for d in source.iterdir() if d.is_dir() and (only_set is None or d.name in only_set)])
    if not folders:
        log.error(f"No subdirectories found in '{source}'")
        sys.exit(1)

    log.info(f"Found {len(folders)} project folder(s) in '{source}'")
    if args.dry_run:
        log.info("DRY-RUN mode — no uploads or DB writes will occur")

    supabase = get_supabase_client()

    total_projects = 0
    total_images = 0
    total_errors = 0

    for folder in folders:
        images, errors = process_project_folder(supabase, folder, args.dry_run)
        if images > 0:
            total_projects += 1
        total_images += images
        total_errors += errors

    print("\n" + "=" * 50)
    print(f"  Projects processed : {total_projects}")
    print(f"  Images uploaded    : {total_images}")
    print(f"  Errors             : {total_errors}")
    print("=" * 50)

    if total_errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
