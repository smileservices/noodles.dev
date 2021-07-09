from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register('category', views.ConceptCategoryViewset, basename='concept-category-viewset')
router.register('technology', views.ConceptTechnologyViewset, basename='concept-technology-viewset')
router.register('category-edit-suggestions', views.CategoryConceptEditSuggestionViewset, basename='concept-category-edit-suggestions-viewset')
router.register('technology-edit-suggestions', views.TechnologyConceptEditSuggestionViewset, basename='concept-technology-edit-suggestions-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('category/<slug:slug>', views.category_detail, name="concept-category-detail"),
    path('category/edit/<int:id>', views.category_edit, name="category-concept-edit"),
    path('category/create', views.category_create, name="category-concept-create"),
    path('technology/create', views.technology_create, name="technology-concept-create"),
    path('technology/<slug:slug>', views.technology_detail, name="concept-technology-detail"),
    path('technology/edit/<int:id>', views.technology_edit, name="technology-concept-edit"),
]