from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy

from .models import Content


class ContentCreate(CreateView):
    model = Content
    fields = '__all__'


class ContentUpdate(UpdateView):
    model = Content
    fields = '__all__'


class ContentDelete(DeleteView):
    model = Content
    success_url = reverse_lazy('Content-list')
