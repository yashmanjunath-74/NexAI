"""NexAI Users – API Views"""
import numpy as np
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from .models import BiometricProfile
from .serializers import (
    NexAITokenObtainPairSerializer,
    UserSerializer,
    UserCreateSerializer,
    BiometricEnrollSerializer,
    BiometricVerifySerializer,
)
from core.permissions import IsChiefSuperintendent

User = get_user_model()

# ─── Auth Views ───────────────────────────────────────────────────────────────


class NexAILoginView(TokenObtainPairView):
    """Role-aware JWT login. Returns access + refresh tokens with role payload."""
    serializer_class = NexAITokenObtainPairSerializer
    permission_classes = [AllowAny]


class NexAIRefreshView(TokenRefreshView):
    """Refresh the access token."""


class NexAILogoutView(TokenBlacklistView):
    """Blacklist the refresh token on logout."""

# ─── User Management ──────────────────────────────────────────────────────────


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Return the currently authenticated user's profile."""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserCreateView(generics.CreateAPIView):
    """Create a new user. CoE only."""
    serializer_class = UserCreateSerializer
    permission_classes = [IsChiefSuperintendent]


class UserListView(generics.ListAPIView):
    """List all users. CoE only."""
    serializer_class = UserSerializer
    permission_classes = [IsChiefSuperintendent]
    queryset = User.objects.all().select_related("department")
    filterset_fields = ["role", "department", "is_active"]
    search_fields = ["email", "full_name", "employee_id"]

# ─── Biometric Views ──────────────────────────────────────────────────────────


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def biometric_enroll(request):
    """
    Enroll or update the student's FaceNet biometric embedding.
    Only the student themselves may enroll.
    """
    serializer = BiometricEnrollSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    profile, created = BiometricProfile.objects.update_or_create(
        student=request.user,
        defaults={
            "face_embedding": serializer.validated_data["face_embedding"],
            "device_hash": serializer.validated_data.get("device_hash", ""),
        },
    )
    return Response(
        {"success": True, "enrolled": True, "created": created},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def biometric_verify(request):
    """
    Verify a live face embedding against the stored profile.
    Returns match=True if cosine similarity > 0.85 threshold.
    """
    serializer = BiometricVerifySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        profile = BiometricProfile.objects.get(student=request.user)
    except BiometricProfile.DoesNotExist:
        return Response(
            {"success": False, "error": "No biometric profile enrolled."},
            status=status.HTTP_404_NOT_FOUND,
        )

    stored = np.array(profile.face_embedding)
    live = np.array(serializer.validated_data["face_embedding"])

    # Cosine similarity
    similarity = float(np.dot(stored, live) / (np.linalg.norm(stored) * np.linalg.norm(live)))
    THRESHOLD = 0.85
    matched = similarity >= THRESHOLD

    return Response(
        {
            "success": True,
            "match": matched,
            "similarity": round(similarity, 4),
            "threshold": THRESHOLD,
        },
        status=status.HTTP_200_OK,
    )
