from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader
from django.shortcuts import render

# Create your views here.
def defaultView(request):
    return render(
        request=request,
        template_name="photaPhysics/default.html",
        context=None
    )

# Create your views here.
