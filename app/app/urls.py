from django.urls import path, include, re_path
from rest_framework import routers
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500
from frontend.views import error_404, error_500
from django.contrib.sitemaps.views import sitemap
from .sitemap import TechnologiesSiteMap, CategoryConceptsSiteMap, TechnologyConceptsSiteMap, ResourcesSiteMap, CollectionsSiteMap, CategoriesSiteMap

router = routers.DefaultRouter()

sitemaps = {
    'categories': CategoriesSiteMap,
    'category_concepts': CategoryConceptsSiteMap,
    'technologies': TechnologiesSiteMap,
    'technology_concepts': TechnologyConceptsSiteMap,
    'resources': ResourcesSiteMap,
    'collections': CollectionsSiteMap,
}

# Registration & Login
urlpatterns = [
    path('', include('frontend.urls')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('accounts/', include('allauth.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('tutorials/', include('study_resource.urls')),
    path('collections/', include('study_collection.urls')),
    path('concepts/', include('concepts.urls')),
    path('categories/', include('category.urls')),
    path('tags/', include('tag.urls')),
    path('learn/', include('technology.urls')),
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
