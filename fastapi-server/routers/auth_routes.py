from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from auth import get_admin_user, get_current_user, hash_password, verify_password
from models import AuthIn, AuthResponse, ChangePasswordIn, MessageResponse
from postgres_db import ADMIN_EMAIL, User, get_session, serialize_user
from routers.helpers import auth_payload, parse_int_id

router = APIRouter(tags=["auth"])


@router.post("/register", status_code=201, response_model=AuthResponse)
async def register(body: AuthIn, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    email = body.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail={"message": "Enter a valid email address."})
    if email == ADMIN_EMAIL:
        raise HTTPException(
            status_code=400,
            detail={"message": "This email cannot be used. Please try another."},
        )
    user = User(
        email=email,
        password_hash=hash_password(body.password),
        role="user",
        display_name=email.split("@")[0],
    )
    session.add(user)
    try:
        await session.commit()
        await session.refresh(user)
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(
            status_code=400,
            detail={"message": "This email already has an account. Log in instead."},
        ) from exc
    return auth_payload(user, include_token=False)


@router.post("/login", response_model=AuthResponse)
async def login(body: AuthIn, session: AsyncSession = Depends(get_session)) -> AuthResponse:
    email = body.email.strip().lower()
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail={"message": "Incorrect email or password."},
        )
    user.last_login = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(user)
    return auth_payload(user)


@router.get("/me", response_model=AuthResponse)
async def me(user: User = Depends(get_current_user)) -> AuthResponse:
    return auth_payload(user, include_token=False)


@router.post("/change-password", response_model=MessageResponse)
async def change_password(
    body: ChangePasswordIn,
    admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
) -> MessageResponse:
    row = await session.get(User, admin.id)
    if row is None:
        raise HTTPException(status_code=401, detail={"message": "Please sign in again."})
    if not verify_password(body.currentPassword, row.password_hash):
        raise HTTPException(
            status_code=400,
            detail={"message": "Current password is incorrect."},
        )
    if body.newPassword == body.currentPassword:
        raise HTTPException(
            status_code=400,
            detail={"message": "New password must be different from the current password."},
        )
    row.password_hash = hash_password(body.newPassword)
    await session.commit()
    return MessageResponse(message="Password updated successfully")


@router.get("/all-users")
async def all_users(
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
) -> list[dict[str, Any]]:
    try:
        result = await session.execute(select(User).order_by(User.created_at.desc()))
        return [serialize_user(row) for row in result.scalars().all()]
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while fetching users",
                "error": str(exc),
            },
        ) from exc


@router.delete("/delete-user/{user_id}", response_model=MessageResponse)
async def delete_user(
    user_id: str,
    admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
) -> MessageResponse:
    try:
        row = await session.get(User, parse_int_id(user_id, "user"))
        if row is None:
            raise HTTPException(status_code=404, detail={"message": "User not found"})
        if row.id == admin.id or row.role == "admin" or row.email == ADMIN_EMAIL:
            raise HTTPException(
                status_code=400,
                detail={"message": "The admin account cannot be deleted."},
            )
        await session.delete(row)
        await session.commit()
        return MessageResponse(message="User deleted successfully")
    except HTTPException:
        raise
    except Exception as exc:
        await session.rollback()
        raise HTTPException(
            status_code=500,
            detail={
                "message": "An error occurred while deleting the user",
                "error": str(exc),
            },
        ) from exc
