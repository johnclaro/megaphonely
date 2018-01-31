from rest_framework import viewsets

from django.contrib.auth.models import User

from .models import Profile, Twitter, Facebook
from .serializers import (UserSerializer, ProfileSerializer, TwitterSerializer,
                          FacebookSerializer)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class TwitterViewSet(viewsets.ModelViewSet):
    queryset = Twitter.objects.all()
    serializer_class = TwitterSerializer


class FacebookViewSet(viewsets.ModelViewSet):
    queryset = Facebook.objects.all()
    serializer_class = FacebookSerializer
