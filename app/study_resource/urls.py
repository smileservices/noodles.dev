from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register('resources', views.StudyResourceViewset, basename='study-resource-viewset')
router.register('tags', views.TagViewset, basename='tags-viewset')
router.register('techs', views.TechViewset, basename='techs-viewset')
router.register('reviews', views.ReviewVieset, basename='review-viewset')
router.register('collections', views.CollectionViewset, basename='collection-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('<int:id>', views.detail, name='detail'),
    path('create/', views.create, name='create-resource'),
    path('', views.search, name='search')
]