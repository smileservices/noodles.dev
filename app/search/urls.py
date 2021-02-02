from rest_framework.routers import DefaultRouter
from django.urls import path, include

from . import views

urlpatterns = [
    path('autocomplete/<str:prefix>/', views.autocomplete, name='autocomplete'),
    path('<str:index>/<str:term>', views.search_specific, name='search_specific'),
    path('<str:term>', views.search_all, name='search_all'),
]