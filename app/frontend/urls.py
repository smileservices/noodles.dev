from django.urls import include, path
from frontend import views

urlpatterns = [
    path('', views.homepage, name='homepage')
]
