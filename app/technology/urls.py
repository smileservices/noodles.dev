from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TechViewset, TechViewsetOptions

router = DefaultRouter()
router.register('as-options', TechViewsetOptions, basename='techs-options')
router.register('', TechViewset, basename='techs-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
]