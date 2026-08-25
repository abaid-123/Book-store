from pydantic import BaseModel, ConfigDict, Field


class BookIn(BaseModel):
    """Payload used by the React upload and edit forms."""

    model_config = ConfigDict(extra="allow")

    title: str
    author: str
    imgURL: str | None = None
    bookpdf: str | None = None
    rating: str | float | int | None = None
    publishedYear: str | int | None = None
    genre: str | None = None


class BookUpdate(BaseModel):
    model_config = ConfigDict(extra="allow")

    title: str | None = None
    author: str | None = None
    imgURL: str | None = None
    bookpdf: str | None = None
    rating: str | float | int | None = None
    publishedYear: str | int | None = None
    genre: str | None = None


class MessageResponse(BaseModel):
    model_config = ConfigDict(exclude_none=True)

    message: str
    error: str | None = None


class AddBookResponse(BaseModel):
    message: str
    bookId: str


class ReviewIn(BaseModel):
    name: str | None = Field(default=None, max_length=80)
    role: str | None = Field(default=None, max_length=80)
    comment: str = Field(min_length=8, max_length=600)
    rating: int = Field(default=5, ge=1, le=5)


class AddReviewResponse(BaseModel):
    message: str
    reviewId: str


class AuthIn(BaseModel):
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=6, max_length=72)


class AuthResponse(BaseModel):
    model_config = ConfigDict(exclude_none=True)

    token: str | None = None
    email: str
    role: str
    displayName: str


class ChangePasswordIn(BaseModel):
    currentPassword: str = Field(min_length=6, max_length=72)
    newPassword: str = Field(min_length=6, max_length=72)
