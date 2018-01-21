from rest_framework import viewsets

from django.contrib.auth.models import User

from .models import Profile
from .serializers import (UserSerializer, ProfileSerializer)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
