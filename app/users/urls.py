from django.urls import include, path
from users import views

urlpatterns = [
    path('my-profile', views.my_profile, name='my-profile'),
    path('my-profile/settings', views.my_settings, name='my-settings'),
    path('my-profile/edit', views.EditProfile.as_view(), name='my-profile-edit'),
    path('my-resources', views.my_resources, name='my-resources'),
    path('my-reviews', views.my_reviews, name='my-reviews'),
    path('my-technologies', views.my_technologies, name='my-technologies'),
    path('my-collections', views.my_collections, name='my-collections'),

    path('api/user_data', views.user_data, name='user-data'),
    path('api/<int:pk>/<str:index>', views.user_content, name='user-content'),
    path('profile/<str:username>', views.user_profile, name='user-profile'),
]