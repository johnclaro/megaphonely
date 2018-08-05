from django.urls import re_path, path
from django.views.generic import TemplateView

from .views import (
    index
)

app_name = 'influence'

urlpatterns = [
    path('', index, name='index'),
]
