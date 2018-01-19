from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

from .models import Content
from .serializers import (ContentSerializer, UserSerializer,
                          SocialAccountSerializer)


class ContentViewSet(ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class SocialAccountViewSet(ModelViewSet):
    queryset = SocialAccount.objects.all()
    serializer_class = SocialAccountSerializer
