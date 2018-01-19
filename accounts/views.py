from rest_framework import viewsets

from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

from .serializers import UserSerializer, SocialAccountSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SocialAccountViewSet(viewsets.ModelViewSet):
    queryset = SocialAccount.objects.all()
    serializer_class = SocialAccountSerializer
