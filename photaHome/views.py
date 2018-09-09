from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from photaHome.models import Socialprofile

# Create your views here.
def homeView(request):

    return render(
        request,
        'photaHome/home.html',
        {
            'HOME_ON':False,
            'profiles':Socialprofile.objects.all(),
            'bgs': ['bubsrt','sinfunc','stdist'],
        }
    )
