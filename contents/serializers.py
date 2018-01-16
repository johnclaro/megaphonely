from rest_framework.serializers import (HyperlinkedModelSerializer)

from .models import Content


class ContentSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Content
        fields = ('message', )
