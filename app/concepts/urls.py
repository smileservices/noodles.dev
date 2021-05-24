from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register('category', views.ConceptCategoryViewset, basename='concept-category-viewset')
router.register('technology', views.ConceptTechnologyViewset, basename='concept-technology-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('category/<int:id>/<slug:slug>', views.category_detail, name="concept-category-detail"),
    path('technology/<int:id>/<slug:slug>', views.technology_detail, name="concept-technology-detail")
]