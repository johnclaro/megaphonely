from rest_framework.viewsets import ModelViewSet

from .models import ContentModel
from .serializers import ContentSerializer


class ContentViewSet(ModelViewSet):
    """API endpoint to get contents"""
    queryset = ContentModel.objects.all()
    serializer_class = ContentSerializer
