from django.urls import include, path
from django.shortcuts import render
from frontend import views
from django.conf import settings

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('sidebar/', views.sidebar_categories, name='sidebar-content'),
    path('api/aggregations/study-resources', views.homepage_resources, name='homepage_resources'),
    path('api/aggregations/collections', views.homepage_collections, name='homepage_collections'),
    path('api/aggregations/technologies', views.homepage_technologies, name='homepage_technologies'),
    path('api/aggregations', views.aggregations, name='aggregations'),
    path('terms/privacy-policy', lambda request: render(request, 'frontend/static/privacy.html'), name='privacy-policy'),
    path('terms/terms-conditions', lambda request: render(request, 'frontend/static/terms.html'), name='terms-policy'),
    path('terms/cookies-policy', lambda request: render(request, 'frontend/static/cookie-terms.html'), name='cookie-policy'),
    path('backstage', lambda request: render(request, 'frontend/static/backstage.html'), name='noodles-backstage'),
    path('about', lambda request: render(request, 'frontend/static/about.html'), name='noodles-about'),
]

if settings.DEBUG:
    urlpatterns += [
        path('test_error_500', views.test_error_500, name='test_error_500'),
        path('test_error_404', views.test_error_404, name='test_error_404'),
    ]