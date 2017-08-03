from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from photaHome.pageapps import get_pageapp_classes
from photaHome.models import Socialprofile

# Create your views here.
def homeView(request):
    apps = get_pageapp_classes()

    page_names = []
    page_hrefs = []
    page_icons = []
    for app in apps:
        page_names+=[app.page_name]
        page_hrefs+=[app.href]
        page_icons+=[app.icon_class]

    return render(
        request,
        'photaHome/home.html',
        {
            'page_apps':zip(page_names,page_hrefs,page_icons),
            'profiles':Socialprofile.objects.all(),
        }
    )
