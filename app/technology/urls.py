from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TechViewset, TechViewsetOptions, TechEditSuggestionViewset, detail, create, edit

router = DefaultRouter()
router.register('as-options', TechViewsetOptions, basename='techs-options')
router.register('edit-suggestions', TechEditSuggestionViewset, basename='techs-edit-suggestions-viewset')
router.register('', TechViewset, basename='techs-viewset')

urlpatterns = [
    path('create/', create, name='tech-create'),
    path('api/', include(router.urls)),
    path('<int:id>/edit', edit, name='tech-edit'),
    path('<int:id>/<slug:slug>', detail, name='tech-detail'),
]