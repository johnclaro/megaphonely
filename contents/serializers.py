from rest_framework import serializers

from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

from .models import Content


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


class ContentSerializer(serializers.HyperlinkedModelSerializer):
    social_account = SocialAccountSerializer(read_only=True, many=True)

    class Meta:
        model = Content
        fields = '__all__'
