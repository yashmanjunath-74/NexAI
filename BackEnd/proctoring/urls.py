from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProctoringSessionViewSet

router = DefaultRouter()
router.register(r'sessions', ProctoringSessionViewSet, basename='proctoringsession')

urlpatterns = [
    path('', include(router.urls)),
]
