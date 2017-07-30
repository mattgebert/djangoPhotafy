from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from djangoPhotafy.settings import PAGE_APPS
from photaHome.pageapps import get_page_app
from photaHome.models import Socialprofile

# Create your views here.
def homeView(request):
    apps = getAppDetails()

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

#Used to load different page app names
def getAppDetails():
    applist = []
    for app in PAGE_APPS:
        klass = get_page_app(app)
        applist += [klass]
        return applist
