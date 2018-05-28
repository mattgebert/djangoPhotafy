from django.shortcuts import render, reverse
from django.views.generic.edit import FormView
from .forms import FileFieldForm
from django.contrib.auth.decorators import login_required

class FileFieldView(FormView):
    form_class = FileFieldForm
    template_name = 'amy/content_upload.html'  # Replace with your template.
    success_url = 'amy'  # Replace with your URL or reverse().

    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        files = request.FILES.getlist('file_field')
        if form.is_valid():
            for f in files:
                # ... Do something with each file.
                print(f)
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

# Create your views here.
from datetime import *
event_posts = [
    # ('2017 Birthday', date(2017,6,18), 'A birthday card for Amy\'s 20th Birthday! Includes a handful of images that depict some of our time together.'),
]

@login_required(login_url='/accounts/login') #TODO in future - change to a permission_required
def homeView(request):
    return render(request,
    'amy/home.html',
    {
        'event_posts':event_posts,
    })

def get_img(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = FileFieldForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            return HttpResponseRedirect('/amy/')

            # if a GET (or any other method) we'll create a blank form
    else:
        form = FileFieldForm()
        return render(request, 'amy/content_upload.html',
        {
            'form': form,
        })


# def defaultView(request):
#     return render(request,
#     'amy/2017birthday.html',
#     {'img_set':ImageSet.objects.filter(set_name="set1")[0].image_set.all()})
#     # {'img_set':Image.objects.all()})


# def templateView(request):
# return render(
# request=request,
# template_name=
# )
