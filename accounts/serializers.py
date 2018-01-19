from rest_framework import serializers
from allauth.socialaccount.models import SocialAccount

from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    contents = serializers.HyperlinkedRelatedField(
        many=True, view_name='content-detail', read_only=True
    )

    class Meta:
        model = User
        fields = ('url', 'contents', 'username', 'password',)


class SocialAccountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SocialAccount
        fields = '__all__'
