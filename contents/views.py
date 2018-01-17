from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from django.contrib.auth.models import User

from .models import Content
from .serializers import ContentSerializer, UserSerializer


class ContentViewSet(ModelViewSet):
    """API endpoint to get contents"""
    queryset = Content.objects.all()
    serializer_class = ContentSerializer

class UserViewSet(ReadOnlyModelViewSet):
    """API endpoint to get users"""
    queryset = User.objects.all()
    serializer_class = UserSerializer