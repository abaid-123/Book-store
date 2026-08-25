from routers.auth_routes import router as auth_router
from routers.books import router as books_router
from routers.reviews import router as reviews_router
from routers.uploads import router as uploads_router

__all__ = ["auth_router", "books_router", "reviews_router", "uploads_router"]
