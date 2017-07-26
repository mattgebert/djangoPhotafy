from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from .settings import PAGE_APPS, verify_page_app

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

    return render(request,
        'djangoPhotafy/home.html',
        {
            'page_apps':zip(page_names,page_hrefs,page_icons),
            # 'page_names':page_names,
            # 'page_hrefs':page_hrefs,
            # 'page_icons':page_icons,
        }
        )


#Used to load different page app names
def getAppDetails():
    applist = []
    for app in PAGE_APPS:
        klass = verify_page_app(app)
        if type(klass) is type(type):
            applist += [klass]
            print(klass.icon_class)
            #applist += [[klass.page_name, klass.page_url, klass.icon_class]]
    return applist
