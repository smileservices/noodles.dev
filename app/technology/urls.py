from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TechViewset

router = DefaultRouter()
router.register('', TechViewset, basename='techs-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
]