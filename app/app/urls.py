from django.urls import path, include, re_path
from rest_framework import routers
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500
from frontend.views import error_404, error_500

router = routers.DefaultRouter()

# Registration & Login
urlpatterns = [
    path('', include('frontend.urls')),
    path('accounts/', include('allauth.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('tutorials/', include('study_resource.urls')),
    path('collections/', include('study_collection.urls')),
    path('concepts/', include('concepts.urls')),
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

handler404 = error_404
handler500 = error_500

# from django.contrib.staticfiles.views import serve as serve_static
# need this for testing the error pages because Debug=False
# stops runserver server serving static files ffs
#
# def _static_butler(request, path, **kwargs):
#     """
#     Serve static files using the django static files configuration
#     WITHOUT collectstatic. This is slower, but very useful for API
#     only servers where the static files are really just for /admin
#
#     Passing insecure=True allows serve_static to process, and ignores
#     the DEBUG=False setting
#     """
#     return serve_static(request, path, insecure=True, **kwargs)
#
# urlpatterns += [
#     re_path(r'static/(.+)', _static_butler)
# ]
