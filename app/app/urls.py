from django.urls import path, include
from rest_framework import routers
from django.contrib import admin
from django.conf import settings
router = routers.DefaultRouter()

# Registration & Login
urlpatterns = [
    path('', include('frontend.urls')),
    path('accounts/', include('allauth.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('tutorials/', include('study_resource.urls')),
    path('users/', include('users.urls')),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns

urlpatterns += router.urls