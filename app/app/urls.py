from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()

# Registration & Login
urlpatterns = [
    path('', include('frontend.urls')),
]

urlpatterns += router.urls