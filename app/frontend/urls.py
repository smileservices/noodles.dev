from django.urls import include, path
from django.shortcuts import render
from frontend import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('terms/privacy-policy', lambda request: render(request, 'frontend/static/privacy.html'), name='privacy-policy'),
    path('terms/terms-conditions', lambda request: render(request, 'frontend/static/terms.html'), name='terms-policy'),
    path('terms/cookies-policy', lambda request: render(request, 'frontend/static/cookie-terms.html'), name='cookie-policy'),
]
