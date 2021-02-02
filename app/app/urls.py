from django.urls import path, include
from rest_framework import routers
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()

# Registration & Login
urlpatterns = [
    path('', include('frontend.urls')),
    path('accounts/', include('allauth.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('tutorials/', include('study_resource.urls')),
    path('collections/', include('study_collection.urls')),
    path('problems-solutions/', include('problem_solution.urls')),
    path('categories/', include('category.urls')),
    path('tags/', include('tag.urls')),
    path('technologies/', include('technology.urls')),
    path('users/', include('users.urls')),
    path('search/', include('search.urls')),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += router.urls