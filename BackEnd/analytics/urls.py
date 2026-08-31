from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLedgerViewSet, PerformanceMetricsViewSet

router = DefaultRouter()
router.register(r'audit', AuditLedgerViewSet, basename='audit')
router.register(r'metrics', PerformanceMetricsViewSet, basename='metrics')

urlpatterns = [
    path('', include(router.urls)),
]
