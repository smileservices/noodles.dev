from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TechViewset, TechViewsetOptions, detail

router = DefaultRouter()
router.register('as-options', TechViewsetOptions, basename='techs-options')
router.register('', TechViewset, basename='techs-viewset')

urlpatterns = [
    path('<int:id>', detail, name='tech-detail'),
    path('api/', include(router.urls)),
]