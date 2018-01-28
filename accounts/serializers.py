from rest_framework import serializers

from django.contrib.auth.models import User

from .models import Profile, Twitter, Facebook


class UserSerializer(serializers.HyperlinkedModelSerializer):
    contents = serializers.HyperlinkedRelatedField(
        many=True, view_name='content-detail', read_only=True
    )

    class Meta:
        model = User
        fields = ('url', 'contents', 'username', 'password',)


class TwitterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Twitter
        fields = '__all__'


class FacebookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Facebook
        fields = '__all__'


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
