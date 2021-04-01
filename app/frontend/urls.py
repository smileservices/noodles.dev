from django.urls import include, path
from django.shortcuts import render
from frontend import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('sidebar/', views.sidebar, name='sidebar-content'),
    path('api/aggregations/study-resources', views.homepage_resources, name='homepage_resources'),
    path('api/aggregations/collections', views.homepage_collections, name='homepage_collections'),
    path('api/aggregations/technologies', views.homepage_technologies, name='homepage_technologies'),
    path('api/aggregations', views.aggregations, name='aggregations'),
    path('terms/privacy-policy', lambda request: render(request, 'frontend/static/privacy.html'), name='privacy-policy'),
    path('terms/terms-conditions', lambda request: render(request, 'frontend/static/terms.html'), name='terms-policy'),
    path('terms/cookies-policy', lambda request: render(request, 'frontend/static/cookie-terms.html'), name='cookie-policy'),
]
