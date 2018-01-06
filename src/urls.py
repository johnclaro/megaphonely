from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from src.accounts.views import UserViewSet

router = DefaultRouter()
router.register(r'accounts', UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]