from django.urls import path, include
from rest_framework import routers
from django.contrib import admin

router = routers.DefaultRouter()

# Registration & Login
urlpatterns = [
    path('', include('frontend.urls')),
    path('accounts/', include('allauth.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('admin/', admin.site.urls),
]

urlpatterns += router.urls