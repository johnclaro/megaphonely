from django.contrib.auth.models import User, Group
from rest_framework.serializers import HyperlinkedModelSerializer


class UserSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password', 'groups')


class GroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')