from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewset, CategoryViewsetSelect

router = DefaultRouter()
router.register('as-options', CategoryViewsetSelect, basename='categories-options')
router.register('', CategoryViewset, basename='categories-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
]