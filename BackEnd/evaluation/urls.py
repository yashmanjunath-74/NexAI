from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnswerScriptViewSet

router = DefaultRouter()
router.register(r'scripts', AnswerScriptViewSet, basename='answerscript')

urlpatterns = [
    path('', include(router.urls)),
]
