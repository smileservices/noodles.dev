from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TagViewset, TagViewsetSelect

router = DefaultRouter()
router.register('as-options', TagViewsetSelect, basename='tags-options')
router.register('', TagViewset, basename='tags-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
]