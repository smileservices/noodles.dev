from rest_framework.routers import DefaultRouter
from django.urls import path, include

from . import views

urlpatterns = [
    path('api/autocomplete/<str:prefix>/', views.autocomplete, name='autocomplete'),
    path('api/<str:index>', views.search_specific, name='search_specific'),
    path('', views.search_page, name='search_page'),
]