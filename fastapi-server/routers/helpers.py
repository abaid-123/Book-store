from fastapi import HTTPException

from auth import create_token
from models import AuthResponse
from postgres_db import User, display_name_for


def parse_int_id(raw_id: str, label: str = "book") -> int:
    try:
        value = int(raw_id)
    except (TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=400, detail={"message": f"Invalid {label} ID"}
        ) from exc
    if value < 1:
        raise HTTPException(status_code=400, detail={"message": f"Invalid {label} ID"})
    return value


def auth_payload(user: User, include_token: bool = True) -> AuthResponse:
    return AuthResponse(
        token=create_token(user) if include_token else None,
        email=user.email,
        role=user.role,
        displayName=display_name_for(user),
    )
