from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from photaHome.pageapps import get_pageapp_webitems
from photaHome.models import Socialprofile

# Create your views here.
def homeView(request):
    page_apps = get_pageapp_webitems()

    return render(
        request,
        'photaHome/home.html',
        {
            'HOME_ON':False,
            'page_apps':page_apps,
            'profiles':Socialprofile.objects.all(),
        }
    )
