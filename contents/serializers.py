from rest_framework.serializers import HyperlinkedModelSerializer

from .models import ContentModel


class ContentSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = ContentModel
        fields = ('message', )
