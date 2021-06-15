from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register('as-options', views.CategoryViewsetSelect, basename='categories-options')
router.register('', views.CategoryViewset, basename='categories-viewset')

urlpatterns = [
    path('<slug:slug>', views.detail, name="category-detail"),
    path('api/', include(router.urls)),
]