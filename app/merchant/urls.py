from rest_framework.routers import DefaultRouter
from .views import MerchantViewset

router = DefaultRouter()
router.register(
    'api', MerchantViewset, basename='admin_merchant'
)

urlpatterns = []
urlpatterns += router.urls