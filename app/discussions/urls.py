from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

router = DefaultRouter()
router.register('', views.DiscussionViewset, basename='discussion-viewset')
urlpatterns = [
    path('api/', include(router.urls)),
]
