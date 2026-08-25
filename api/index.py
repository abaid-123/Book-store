import sys
import traceback
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import JSONResponse

HERE = Path(__file__).resolve().parent
SEARCH = [
    HERE.parent / "fastapi-server",
    Path.cwd() / "fastapi-server",
    HERE / "fastapi-server",
]
server_dir = next((path for path in SEARCH if (path / "main.py").exists()), None)
if server_dir is not None:
    sys.path.insert(0, str(server_dir))

try:
    from main import app  # noqa: E402, F401
except Exception as exc:
    app = FastAPI(title="Book Store API error")

    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
    async def startup_error(full_path: str) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={
                "message": "API failed to start",
                "error": str(exc),
                "trace": traceback.format_exc(),
                "cwd": str(Path.cwd()),
                "here": str(HERE),
                "serverDir": str(server_dir),
            },
        )
