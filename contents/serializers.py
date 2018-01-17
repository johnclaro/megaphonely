from rest_framework.serializers import (HyperlinkedModelSerializer,
                                        HyperlinkedRelatedField)

from django.contrib.auth.models import User

from .models import Content


class ContentSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Content
        fields = ('url', 'message', 'publisher',)


class UserSerializer(HyperlinkedModelSerializer):
    contents = HyperlinkedRelatedField(
        many=True, view_name='content-detail', read_only=True
    )

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'contents')
