from .views import CollectionViewset
from rest_framework.routers import DefaultRouter
from django.urls import path, include

from . import views

router = DefaultRouter()
router.register('', CollectionViewset, basename='collection-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('my-collections', views.my_collections, name='my-collections'),
    path('<int:id>/<slug:slug>', views.detail, name='collection-detail'),
    path('<int:id>', views.detail, name='collection-edit'),
    # todo browse
    # todo edit
]