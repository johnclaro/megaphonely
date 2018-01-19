from rest_framework.viewsets import ModelViewSet

from .models import Content
from .serializers import ContentSerializer


class ContentViewSet(ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
