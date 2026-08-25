from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import AddBookResponse, BookIn, BookUpdate, MessageResponse
from postgres_db import Book, as_optional_str, book_from_payload, get_session, serialize_book
from routers.helpers import parse_int_id

router = APIRouter(tags=["books"])


@router.post("/add-book", status_code=201, response_model=AddBookResponse)
async def add_book(
    book: BookIn, session: AsyncSession = Depends(get_session)
) -> AddBookResponse:
    try:
        row = book_from_payload(book.model_dump())
        session.add(row)
        await session.commit()
        await session.refresh(row)
        return AddBookResponse(
            message="Book added successfully",
            bookId=str(row.id),
        )
    except Exception as exc:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while adding the book",
                "error": str(exc),
            },
        ) from exc


@router.get("/all-books")
async def all_books(session: AsyncSession = Depends(get_session)) -> list[dict[str, Any]]:
    try:
        result = await session.execute(select(Book).order_by(Book.id))
        return [serialize_book(book) for book in result.scalars().all()]
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while fetching the books",
                "error": str(exc),
            },
        ) from exc


@router.put("/update-book/{book_id}", response_model=MessageResponse)
async def update_book(
    book_id: str,
    book: BookUpdate,
    session: AsyncSession = Depends(get_session),
) -> MessageResponse:
    try:
        row_id = parse_int_id(book_id)
        row = await session.get(Book, row_id)
        if row is None:
            raise HTTPException(status_code=404, detail={"message": "Book not found"})
        updates = {
            key: value
            for key, value in book.model_dump(exclude_unset=True).items()
            if value is not None and key in {
                "title",
                "author",
                "imgURL",
                "bookpdf",
                "rating",
                "publishedYear",
                "genre",
            }
        }
        for key, value in updates.items():
            if key in {"rating", "publishedYear", "imgURL", "bookpdf", "genre"}:
                setattr(row, key, as_optional_str(value))
            else:
                setattr(row, key, value)
        await session.commit()
        return MessageResponse(message="Book updated successfully")
    except HTTPException:
        raise
    except Exception as exc:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while updating the book",
                "error": str(exc),
            },
        ) from exc


@router.delete("/delete-book/{book_id}", response_model=MessageResponse)
async def delete_book(
    book_id: str, session: AsyncSession = Depends(get_session)
) -> MessageResponse:
    try:
        row_id = parse_int_id(book_id)
        row = await session.get(Book, row_id)
        if row is None:
            raise HTTPException(status_code=404, detail={"message": "Book not found"})
        await session.delete(row)
        await session.commit()
        return MessageResponse(message="Book deleted successfully")
    except HTTPException:
        raise
    except Exception as exc:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while deleting the book",
                "error": str(exc),
            },
        ) from exc


@router.get("/book/{book_id}")
async def get_book(
    book_id: str, session: AsyncSession = Depends(get_session)
) -> dict[str, Any]:
    try:
        row = await session.get(Book, parse_int_id(book_id))
        if row is None:
            raise HTTPException(status_code=404, detail={"message": "Book not found"})
        return serialize_book(row)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while fetching the book",
                "error": str(exc),
            },
        ) from exc
