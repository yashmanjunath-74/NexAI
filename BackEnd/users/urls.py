"""NexAI Users – URL Configuration"""
from django.urls import path
from .views import (
    NexAILoginView,
    NexAIRefreshView,
    NexAILogoutView,
    UserProfileView,
    UserCreateView,
    UserListView,
    biometric_enroll,
    biometric_verify,
)

app_name = "users"

urlpatterns = [
    # Auth
    path("login/",          NexAILoginView.as_view(),   name="login"),
    path("refresh/",        NexAIRefreshView.as_view(), name="token-refresh"),
    path("logout/",         NexAILogoutView.as_view(),  name="logout"),

    # Profile
    path("me/",             UserProfileView.as_view(),  name="profile"),

    # User management (CoE only)
    path("users/",          UserListView.as_view(),     name="user-list"),
    path("users/create/",   UserCreateView.as_view(),   name="user-create"),

    # Biometrics
    path("biometric/enroll/",  biometric_enroll,  name="biometric-enroll"),
    path("biometric/verify/",  biometric_verify,  name="biometric-verify"),
]
