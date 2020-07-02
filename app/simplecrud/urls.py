from django.urls import path
from rest_framework.routers import DefaultRouter
from simplecrud.views import AdminApp, PeopleAdminViewset

router = DefaultRouter()
router.register('api', PeopleAdminViewset, basename='simplecrud-admin-api')
urlpatterns = [
    path('', AdminApp, name='simplecrud-admin')
]

urlpatterns += router.urls