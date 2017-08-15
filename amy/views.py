from django.shortcuts import render

# Create your views here.

def templateView(request):
    return render(
        request=request,
        template_name=
    )


# Create your views here.
def defaultView(request):
    return render(request,
    'amy/2017birthday.html',
    {'img_set':ImageSet.objects.filter(set_name="set1")[0].image_set.all()})
    # {'img_set':Image.objects.all()})


#Use Tuples, and then a for a,b,c in list to get items!
posts = [
    #(<PageExtension>,<TemplateName>,<>)
    ('spinning_circle','','')
]
