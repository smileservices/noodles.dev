from django.urls import include, path
from users import views

urlpatterns = [
    path('my-profile', views.my_profile, name='my-profile'),
    path('my-resources', views.my_resources, name='my-resources'),
    path('my-reviews', views.my_reviews, name='my-reviews'),
]
