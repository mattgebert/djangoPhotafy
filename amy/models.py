from django.db import models
from time import strftime # https://docs.djangoproject.com/en/4.1/ref/models/fields/#django.db.models.FileField.upload_to
# from ..settings import STATIC_URL

class Webpage(models.Model):
    pub_date = models.DateTimeField('Date Published');
    #TODO: Implement zipfile upload to unpack and display an 'indexed' html page.


# Create your models here.
class ImageSet(models.Model):
    set_name = models.CharField(max_length=200)

    def __str__(self):
        return self.set_name

# https://docs.djangoproject.com/en/1.11/ref/models/fields/#django.db.models.FileField

from django.utils.safestring import mark_safe

def set_based_upload_to(instance, filename): #https://stackoverflow.com/questions/36149606/how-can-i-set-variable-in-the-path-of-imagefield-of-django
    return "amy/{}/".format(instance.image_set.set_name) + strftime("%Y/%m/%d") + "/{}".format(filename)

class Image(models.Model):
    image_set =      models.ForeignKey(ImageSet, on_delete=models.CASCADE)
    # image = models.ImageField(upload_to=ImageSet.filepath, max_length=200)
    img =           models.ImageField(upload_to=set_based_upload_to, max_length=200) #TODO: Modify
    name =          models.CharField(max_length=200)
    description =   models.CharField(max_length=200)

    def __str__(self):
        return self.name + ": '" + self.description + "'"

    def image_tag(self):
        return mark_safe(u'<img style="width:400px" src="%s" />' % (self.img.url))
    image_tag.short_description = 'Image'

    def image_tag_icon(self):
        return mark_safe(u'<img style="width:40px" src="%s" />' % (self.img.url))
    image_tag_icon.short_description = 'Image'
