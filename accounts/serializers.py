from rest_framework import serializers

from django.contrib.auth.models import User

from .models import Profile, Social


class UserSerializer(serializers.HyperlinkedModelSerializer):
    contents = serializers.HyperlinkedRelatedField(
        many=True, view_name='content-detail', read_only=True
    )

    class Meta:
        model = User
        fields = ('url', 'contents', 'username', 'password',)


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class SocialSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Social
        fields = '__all__'
