from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader

# Create your views here.
def defaultView(request):
    return render(
        request=request,
        template_name="photaMusic/defaultview.html",
        context={
            # Add variables here
        }
    )
