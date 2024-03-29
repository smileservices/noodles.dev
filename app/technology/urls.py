from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register('as-options', views.TechViewsetOptions, basename='techs-options')
router.register('edit-suggestions', views.TechEditSuggestionViewset, basename='techs-edit-suggestions-viewset')
router.register('', views.TechViewset, basename='techs-viewset')

urlpatterns = [
    path('create/', views.create, name='technology-create'),
    path('history/<slug:slug>', views.history, name='technology-history'),
    path('api/', include(router.urls)),
    path('license-options/', views.license_options, name='license-options'),
    path('<int:id>/edit', views.edit, name='tech-edit'),
    path('<slug:slug>', views.detail, name='tech-detail'),
    path('', views.list_all, name='list-all-technologies'),
]