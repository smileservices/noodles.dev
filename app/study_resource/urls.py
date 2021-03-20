from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views.study_resource import StudyResourceViewset, StudyResourceEditSuggestionViewset, create, detail, edit, list_all
from .views.image import StudyImageViewset
from .views.review import ReviewVieset

router = DefaultRouter()
router.register('resources', StudyResourceViewset, basename='study-resource-viewset')
router.register('edit-suggestions', StudyResourceEditSuggestionViewset, basename='study-resource-edit-suggestions-viewset')
router.register('reviews', ReviewVieset, basename='review-viewset')
router.register('images/resources', StudyImageViewset, basename='resource-image-viewset')

urlpatterns = [
    path('api/', include(router.urls)),
    path('<int:id>/edit/', edit, name='study-resource-edit'),
    path('<int:id>/<slug:slug>', detail, name='study-resource-detail'),
    path('create/', create, name='create-resource'),
    path('', list_all, name='list-all-resources')
]