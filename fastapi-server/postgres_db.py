import os
from collections.abc import AsyncGenerator
from datetime import datetime, timezone

from dotenv import load_dotenv
from sqlalchemy import DateTime, Integer, String, Text, func, select, text
from sqlalchemy.engine.url import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy.pool import NullPool

load_dotenv()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@gmail.com").lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin1")

_raw_url = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@127.0.0.1:5432/bookstore",
)
if _raw_url.startswith("postgresql://"):
    DATABASE_URL = _raw_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif _raw_url.startswith("postgres://"):
    DATABASE_URL = _raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
else:
    DATABASE_URL = _raw_url

_db_url = make_url(DATABASE_URL)
for _key in ("sslmode", "ssl", "channel_binding"):
    if _key in _db_url.query:
        _db_url = _db_url.difference_update_query([_key])
DATABASE_URL = _db_url.render_as_string(hide_password=False)

engine = None
SessionLocal: async_sessionmaker[AsyncSession] | None = None


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="user")
    display_name: Mapped[str] = mapped_column(String(80), default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    last_login: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    author: Mapped[str] = mapped_column(String(255))
    imgURL: Mapped[str | None] = mapped_column(Text, nullable=True)
    bookpdf: Mapped[str | None] = mapped_column(Text, nullable=True)
    rating: Mapped[str | None] = mapped_column(String(40), nullable=True)
    publishedYear: Mapped[str | None] = mapped_column(String(20), nullable=True)
    genre: Mapped[str | None] = mapped_column(String(80), nullable=True)


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    role: Mapped[str] = mapped_column(String(80), default="Reader")
    comment: Mapped[str] = mapped_column(String(600))
    rating: Mapped[int] = mapped_column(Integer, default=5)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )


SEED_REVIEWS = [
    {
        "name": "Ayesha Khan",
        "role": "Reader, Lahore",
        "comment": "Found Insurgent here with author, year, and rating on one page. Buy on Amazon actually took me to the book instead of a dead checkout.",
        "rating": 5,
    },
    {
        "name": "Hamza Ali",
        "role": "Student, Karachi",
        "comment": "Shop filters by genre are useful. I searched programming books and opened the details page in a few seconds.",
        "rating": 5,
    },
    {
        "name": "Sara Malik",
        "role": "Teacher, Islamabad",
        "comment": "Clean layout and the Goodreads button helped me read more about a title before buying. This feels like a real store, not dummy cards.",
        "rating": 4,
    },
    {
        "name": "Usman Raza",
        "role": "Book seller, Faisalabad",
        "comment": "Signed in and listed two used books from the dashboard. Customers can see cover, author, and rating the same day.",
        "rating": 5,
    },
]


def display_name_for(user: User) -> str:
    return (user.display_name or "").strip() or user.email.split("@")[0]


def serialize_user(user: User) -> dict:
    created = user.created_at
    last_login = user.last_login
    return {
        "_id": str(user.id),
        "email": user.email,
        "role": user.role,
        "displayName": display_name_for(user),
        "createdAt": created.isoformat() if hasattr(created, "isoformat") else created,
        "lastLogin": last_login.isoformat() if last_login and hasattr(last_login, "isoformat") else last_login,
    }


def as_optional_str(value) -> str | None:
    if value is None or value == "":
        return None
    return str(value)


def book_from_payload(data: dict) -> Book:
    return Book(
        title=str(data.get("title") or "").strip() or "Untitled",
        author=str(data.get("author") or "").strip() or "Unknown",
        imgURL=as_optional_str(data.get("imgURL")),
        bookpdf=as_optional_str(data.get("bookpdf")),
        rating=as_optional_str(data.get("rating")),
        publishedYear=as_optional_str(data.get("publishedYear")),
        genre=as_optional_str(data.get("genre")),
    )


def serialize_book(book: Book) -> dict:
    return {
        "_id": str(book.id),
        "title": book.title,
        "author": book.author,
        "imgURL": book.imgURL,
        "bookpdf": book.bookpdf,
        "rating": book.rating,
        "publishedYear": book.publishedYear,
        "genre": book.genre,
    }


def serialize_review(review: Review) -> dict:
    created = review.created_at
    return {
        "_id": str(review.id),
        "name": review.name,
        "role": review.role,
        "comment": review.comment,
        "rating": review.rating,
        "createdAt": created.isoformat() if hasattr(created, "isoformat") else created,
    }


def _is_local_db() -> bool:
    host = (make_url(DATABASE_URL).host or "").lower()
    return host in {"127.0.0.1", "localhost", "::1"}


def _engine_kwargs() -> dict:
    if _is_local_db():
        return {}
    return {
        "poolclass": NullPool,
        "connect_args": {"ssl": True, "statement_cache_size": 0},
    }


async def _ensure_database() -> None:
    if os.getenv("SKIP_DB_CREATE", "").lower() in {"1", "true", "yes"}:
        return
    if not _is_local_db():
        return
    url = make_url(DATABASE_URL)
    db_name = url.database
    if not db_name:
        raise RuntimeError("DATABASE_URL is missing a database name")
    if not db_name.replace("_", "").isalnum():
        raise RuntimeError("Invalid PostgreSQL database name")

    admin_engine = create_async_engine(
        url.set(database="postgres"),
        isolation_level="AUTOCOMMIT",
    )
    try:
        async with admin_engine.connect() as conn:
            exists = await conn.scalar(
                text("SELECT 1 FROM pg_database WHERE datname = :name"),
                {"name": db_name},
            )
            if not exists:
                await conn.execute(text(f'CREATE DATABASE "{db_name}"'))
                print("created postgres database", db_name)
    finally:
        await admin_engine.dispose()


async def seed_admin_user() -> None:
    from auth import hash_password

    assert SessionLocal is not None
    async with SessionLocal() as session:
        result = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        user = result.scalar_one_or_none()
        if user is None:
            session.add(
                User(
                    email=ADMIN_EMAIL,
                    password_hash=hash_password(ADMIN_PASSWORD),
                    role="admin",
                    display_name="Admin",
                )
            )
            await session.commit()
            print("seeded admin user in postgres")
            return
        if user.role != "admin":
            user.role = "admin"
            await session.commit()


async def seed_reviews() -> None:
    assert SessionLocal is not None
    async with SessionLocal() as session:
        count = await session.scalar(select(func.count()).select_from(Review))
        if count:
            return
        now = datetime.now(timezone.utc)
        for item in SEED_REVIEWS:
            session.add(
                Review(
                    name=item["name"],
                    role=item["role"],
                    comment=item["comment"],
                    rating=item["rating"],
                    created_at=now,
                )
            )
        await session.commit()
        print("seeded reviews in postgres")


def _copy_mongo_docs() -> tuple[list[dict], list[dict]]:
    mongo_uri = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    db_name = os.getenv("MONGO_DB", "Bookinventary")
    try:
        from pymongo import MongoClient
    except ImportError:
        return [], []
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
    try:
        client.admin.command("ping")
        db = client[db_name]
        books = list(db["books"].find())
        reviews = list(db["reviews"].find())
        return books, reviews
    except Exception as exc:
        print("mongo import skipped", exc)
        return [], []
    finally:
        client.close()


async def migrate_from_mongo_if_needed() -> None:
    if os.getenv("VERCEL") or os.getenv("SKIP_MONGO", "").lower() in {"1", "true", "yes"}:
        return
    assert SessionLocal is not None
    async with SessionLocal() as session:
        book_count = await session.scalar(select(func.count()).select_from(Book))
        if book_count:
            return
        books, reviews = _copy_mongo_docs()
        if not books and not reviews:
            return
        for doc in books:
            session.add(book_from_payload(doc))
        review_count = await session.scalar(select(func.count()).select_from(Review))
        if not review_count:
            for doc in reviews:
                rating = doc.get("rating") or 5
                try:
                    rating = int(rating)
                except (TypeError, ValueError):
                    rating = 5
                created = doc.get("createdAt") or datetime.now(timezone.utc)
                session.add(
                    Review(
                        name=str(doc.get("name") or "Reader")[:80],
                        role=str(doc.get("role") or "Reader")[:80],
                        comment=str(doc.get("comment") or "")[:600],
                        rating=max(1, min(5, rating)),
                        created_at=created
                        if isinstance(created, datetime)
                        else datetime.now(timezone.utc),
                    )
                )
        await session.commit()
        print(f"imported {len(books)} books from MongoDB into PostgreSQL")


async def init_postgres() -> None:
    global engine, SessionLocal
    try:
        await _ensure_database()
        engine = create_async_engine(DATABASE_URL, **_engine_kwargs())
        SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            await conn.execute(
                text(
                    "ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ"
                )
            )
        await seed_admin_user()
        await migrate_from_mongo_if_needed()
        await seed_reviews()
        print("postgres connected")
    except Exception as exc:
        print(
            "PostgreSQL connection failed. Set DATABASE_URL "
            "(Neon URL on Vercel Environment Variables)."
        )
        print("postgres error:", exc)
        engine = None
        SessionLocal = None
        if os.getenv("VERCEL"):
            return
        raise RuntimeError("PostgreSQL is not connected") from exc


async def close_postgres() -> None:
    global engine, SessionLocal
    if engine is not None:
        try:
            await engine.dispose()
        except Exception:
            pass
        engine = None
        SessionLocal = None


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    global SessionLocal
    if SessionLocal is None:
        try:
            await init_postgres()
        except Exception:
            SessionLocal = None
    if SessionLocal is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=503,
            detail={
                "message": "Database is not connected. Add DATABASE_URL in Vercel Environment Variables."
            },
        )
    async with SessionLocal() as session:
        yield session
