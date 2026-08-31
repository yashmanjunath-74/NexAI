from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentPortalViewSet

router = DefaultRouter()
router.register(r'portal', StudentPortalViewSet, basename='studentportal')

urlpatterns = [
    path('', include(router.urls)),
]
