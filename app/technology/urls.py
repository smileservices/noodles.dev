from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TechViewset, TechViewsetOptions, detail, create

router = DefaultRouter()
router.register('as-options', TechViewsetOptions, basename='techs-options')
router.register('', TechViewset, basename='techs-viewset')

urlpatterns = [
    path('<int:id>/<slug:slug>', detail, name='tech-detail'),
    path('create/', create, name='tech-create'),
    path('api/', include(router.urls)),
]