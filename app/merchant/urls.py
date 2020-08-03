from django.urls import path
from rest_framework.routers import DefaultRouter
from merchant import views

router = DefaultRouter()
router.register(
    'api', views.MerchantViewset, basename='admin_merchant',
)
router.register(
    'profile/api', views.MerchantProfileViewset, basename='profile_merchant_api',
)

urlpatterns = [
    path('profile/', views.profile, name='profile_merchant')
]
urlpatterns += router.urls