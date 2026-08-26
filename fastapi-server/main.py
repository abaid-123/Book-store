import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse

from postgres_db import SessionLocal, close_postgres, init_postgres
from routers import auth_router, books_router, reviews_router, uploads_router
from routers.uploads import COVERS_DIR

load_dotenv()

FRONTEND_ORIGINS = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGIN", "*").split(",")
    if origin.strip()
]
if not FRONTEND_ORIGINS:
    FRONTEND_ORIGINS = ["*"]


API_PREFIX = ""


@asynccontextmanager
async def lifespan(_app: FastAPI):
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    try:
        await init_postgres()
    except Exception as exc:
        print("postgres init failed:", exc)
        if not os.getenv("VERCEL"):
            raise
    yield
    if not os.getenv("VERCEL"):
        await close_postgres()


app_kwargs = {
    "title": "Book Inventory API",
    "description": "Book Store API backed by PostgreSQL.",
}
if not os.getenv("VERCEL"):
    app_kwargs["lifespan"] = lifespan

app = FastAPI(**app_kwargs)


@app.middleware("http")
async def ensure_database(request: Request, call_next):
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    if SessionLocal is None:
        try:
            await init_postgres()
        except Exception as exc:
            print("postgres init failed:", exc)
    return await call_next(request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_request: Request, exc: HTTPException) -> JSONResponse:
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"message": str(exc.detail)})


@app.get(API_PREFIX or "/", response_class=PlainTextResponse)
async def home() -> str:
    return "Hello world!"


app.include_router(books_router, prefix=API_PREFIX)
app.include_router(reviews_router, prefix=API_PREFIX)
app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(uploads_router, prefix=API_PREFIX)


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "5000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
