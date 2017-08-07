from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader
from django.shortcuts import render
from photaHome.pageapps import get_pageapp_webitems

# Create your views here.
def defaultView(request):
    pageapps = get_pageapp_webitems()

    return render(
        request=request,
        template_name="photaPhysics/default.html",
        context={
            'HOME_ON':True,
            'page_apps':get_pageapp_webitems,

        }
    )

# Create your views here.
