from rest_framework.viewsets import ModelViewSet

from .models import Content
from .serializers import ContentSerializer


class ContentViewSet(ModelViewSet):
    """API endpoint to get contents"""
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
