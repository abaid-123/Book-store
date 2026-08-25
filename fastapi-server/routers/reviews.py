from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_admin_user, get_current_user
from models import AddReviewResponse, MessageResponse, ReviewIn
from postgres_db import Review, User, display_name_for, get_session, serialize_review
from routers.helpers import parse_int_id

router = APIRouter(tags=["reviews"])


@router.get("/all-reviews")
async def all_reviews(
    session: AsyncSession = Depends(get_session),
) -> list[dict[str, Any]]:
    try:
        result = await session.execute(
            select(Review).order_by(Review.created_at.desc()).limit(50)
        )
        return [serialize_review(review) for review in result.scalars().all()]
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while fetching the reviews",
                "error": str(exc),
            },
        ) from exc


@router.post("/add-review", status_code=201, response_model=AddReviewResponse)
async def add_review(
    review: ReviewIn,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> AddReviewResponse:
    try:
        row = Review(
            name=display_name_for(user),
            role=(review.role or "").strip() or "Reader",
            comment=review.comment.strip(),
            rating=review.rating,
        )
        session.add(row)
        await session.commit()
        await session.refresh(row)
        return AddReviewResponse(
            message="Review added successfully",
            reviewId=str(row.id),
        )
    except HTTPException:
        raise
    except Exception as exc:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while adding the review",
                "error": str(exc),
            },
        ) from exc


@router.delete("/delete-review/{review_id}", response_model=MessageResponse)
async def delete_review(
    review_id: str,
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
) -> MessageResponse:
    try:
        row = await session.get(Review, parse_int_id(review_id, "review"))
        if row is None:
            raise HTTPException(status_code=404, detail={"message": "Review not found"})
        await session.delete(row)
        await session.commit()
        return MessageResponse(message="Review deleted successfully")
    except HTTPException:
        raise
    except Exception as exc:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while deleting the review",
                "error": str(exc),
            },
        ) from exc
