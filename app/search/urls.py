from django.urls import path

from . import views

urlpatterns = [
    path('api/autocomplete/<str:prefix>/', views.autocomplete, name='autocomplete'),
    path('api/<str:index>', views.search_specific, name='search_specific'),
    path('api/related/', views.related_data, name='related_data'),
    path('', views.search_page, name='search_page'),
]