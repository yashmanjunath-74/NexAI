from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionPaperViewSet

router = DefaultRouter()
router.register(r'question-papers', QuestionPaperViewSet, basename='question-paper')

urlpatterns = [
    path('', include(router.urls)),
]
