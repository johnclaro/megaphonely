# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.views.generic.edit import FormView

from .forms import ContentForm


class ContentView(FormView):
    template_name = 'contents/schedule_content.html'
    form_class = ContentForm
    success_url = '/success/'

    def form_valid(self, form):
        form.send_email()
        return super(ContentView, self).form_valid(form)
