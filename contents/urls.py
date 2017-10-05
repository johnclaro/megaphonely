from django.conf.urls import url

from .views import ContentView

urlpatterns = [
    url(r'schedule/$', ContentView.as_view(), name='schedule_content'),
]
