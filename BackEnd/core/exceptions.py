"""NexAI Core – Reusable DRF Exception Handler"""
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger("nexai.core")


def nexai_exception_handler(exc, context):
    """Custom exception handler that wraps DRF errors in a consistent shape."""
    response = exception_handler(exc, context)

    if response is not None:
        logger.warning("API error: %s – %s", type(exc).__name__, str(exc))
        return Response(
            {
                "success": False,
                "error": {
                    "type": type(exc).__name__,
                    "detail": response.data,
                },
            },
            status=response.status_code,
        )

    # Unhandled exceptions → 500
    logger.error("Unhandled exception: %s", str(exc), exc_info=True)
    return Response(
        {
            "success": False,
            "error": {
                "type": "InternalServerError",
                "detail": "An unexpected error occurred. Please contact support.",
            },
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
