from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

router = APIRouter(tags=["uploads"])

UPLOAD_ROOT = Path(__file__).resolve().parent.parent / "uploads"
COVERS_DIR = UPLOAD_ROOT / "covers"
ALLOWED_COVER_TYPES = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_COVER_BYTES = 5 * 1024 * 1024


@router.post("/upload-cover")
async def upload_cover(file: UploadFile = File(...)) -> dict[str, str]:
    content_type = (file.content_type or "").lower()
    suffix = ALLOWED_COVER_TYPES.get(content_type)
    if suffix is None:
        name = (file.filename or "").lower()
        for ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
            if name.endswith(ext):
                suffix = ".jpg" if ext == ".jpeg" else ext
                break
    if suffix is None:
        raise HTTPException(
            status_code=400,
            detail={"message": "Please choose a JPG, PNG, WEBP, or GIF image."},
        )
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail={"message": "The image file is empty."})
    if len(data) > MAX_COVER_BYTES:
        raise HTTPException(
            status_code=400,
            detail={"message": "Image must be 5 MB or smaller."},
        )
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{suffix}"
    dest = COVERS_DIR / filename
    dest.write_bytes(data)
    if not dest.is_file():
        raise HTTPException(
            status_code=500,
            detail={"message": "The image could not be saved."},
        )
    return {"imgURL": f"/uploads/covers/{filename}"}


@router.get("/uploads/covers/{filename}")
async def serve_cover(filename: str) -> FileResponse:
    safe_name = Path(filename).name
    path = (COVERS_DIR / safe_name).resolve()
    if path.parent != COVERS_DIR.resolve() or not path.is_file():
        raise HTTPException(status_code=404, detail={"message": "Cover image not found"})
    return FileResponse(path)
