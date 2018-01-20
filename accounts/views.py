from rest_framework import viewsets

from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

from .models import Profile
from .serializers import (UserSerializer, SocialAccountSerializer,
                          ProfileSerializer)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SocialAccountViewSet(viewsets.ModelViewSet):
    queryset = SocialAccount.objects.all()
    serializer_class = SocialAccountSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

