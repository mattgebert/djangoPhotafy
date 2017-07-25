from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from .settings import PAGE_APPS

# Create your views here.
def homeView(request):
    return render(request,
        'djangoPhotafy/home.html',
        )
