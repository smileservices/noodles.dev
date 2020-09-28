from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TagViewset

router = DefaultRouter()
router.register('', TagViewset, basename='tags-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
]