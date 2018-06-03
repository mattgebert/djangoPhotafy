from django.shortcuts import render, reverse
from django.views.generic.edit import FormView
from .forms import FileFieldForm
from django.contrib.auth.decorators import login_required
from .models import ImageSet
from datetime import *
from django.http import Http404

class Event():
    def __init__(self, date, title, description):
        self.date = date
        self.title = title
        self.description = description
        self.day = '{0:02d}'.format(self.date.day)
        self.month = '{0:02d}'.format(self.date.month)
        self.year = '{0:04d}'.format(self.date.year)
        self.template = 'amy/events/' + self.year + '-' + self.month + '-' + self.day + '.html'


event_posts = [
    Event(date(2018,6,18),'2018 Birthday', 'A birthday card for Amy\'s 21th Birthday!'),
    Event(date(2017,6,18),'2017 Birthday', 'A birthday card for Amy\'s 20th Birthday! Includes a handful of images that depict some of our time together.'),
    Event(date(2017,2,14),'2017 Valentines Day', 'What to do when you\'re down at Phillip Island without GF.'),
]

@login_required(login_url='/accounts/login') #TODO in future - change to a permission_required
def homeView(request):
    return render(request,
    'amy/home.html',
    {
        'event_posts':event_posts,
        'img_set':ImageSet.objects.filter(set_name="set1")[0].image_set.all()
    })

### Generic load of an event template.
@login_required(login_url='/accounts/login') #TODO in future - change to a permission_required
def event_display(request, year, month, day):
    year = int(year)
    month = int(month)
    day = int(day)
    event_date = date(year,month,day)
    search = [event for event in event_posts if event.date==event_date] #Get all elements with  matching date.
    if len(search) == 1:
        context = {'event':search[0]}
        return render(request,
        'amy/event_display.html',
        context)
    else:
        # return HttpResponseRedirect('/amy/')
        a = len(search)
        return Http404("%d results found for date %d", a, event_date)

### Working upload of amy's 2017 birthday.
@login_required(login_url='/accounts/login') #TODO in future - change to a permission_required
def event20170618(request):
     return render(request,
     'amy/events/2017-06-18.html',
     {'img_set':ImageSet.objects.filter(set_name="set1")[0].image_set.all()})
     # {'img_set':Image.objects.all()})


### Allows upload of data such as images for amy's database.
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
