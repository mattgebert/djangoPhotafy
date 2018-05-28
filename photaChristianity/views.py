from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.urls import reverse
from django.template import loader
from django.shortcuts import render
from django.urls import resolve

# Create your views here.
def defaultView(request):
    current_url = resolve(request.path_info).url_name
    return render(
        request=request,
        template_name="photaChristianity/home.html",
        context={
            'name':current_url,
            # Add variables here
            }
    )


# Create your views here.


#Use Tuples, and then a for a,b,c in list to get items!
posts = [
    #(<PageExtension>,<TemplateName>,<>)
    ('spinning_circle','','')
]
