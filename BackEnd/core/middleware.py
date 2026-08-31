"""NexAI Core – Request Logging Middleware & JWT WebSocket Auth"""
import logging
import time
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken

logger = logging.getLogger("nexai.core")


class RequestLoggingMiddleware:
    """Log method, path, status code, and latency for every HTTP request."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)
        duration_ms = (time.time() - start) * 1000
        logger.info(
            "%s %s → %s (%.1fms)",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )
        return response


# ─── JWT WebSocket Auth Middleware ────────────────────────────────────────────

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_key: str):
    """Validate a JWT access token and return the corresponding user."""
    try:
        token = AccessToken(token_key)
        user_id = token["user_id"]
        return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    """Attach the authenticated user to WebSocket connections via JWT query param."""

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token_list = params.get("token", [])
        token = token_list[0] if token_list else None

        scope["user"] = await get_user_from_token(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    """Convenience wrapper used in ASGI routing."""
    return JWTAuthMiddleware(inner)
