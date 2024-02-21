from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

from photaHome.models import Socialprofile, Subpagebubble

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

def subpageView(request, article_name):
    try:
        subpage = Subpagebubble.objects.filter(
            href__startswith=article_name
        )[0]
    except Subpagebubble.DoesNotExist:
        raise Http404("This subpage doesn't exist.")
    return render(
        request,
        'photaHome/subpage.html',
        {
            'subpage': subpage,
            'template_path':subpage.template_path + "/content.html"
        }
    )
