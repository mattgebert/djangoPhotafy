from django.db import models
# from ..settings import STATIC_URL

class Webpage(models.Model):
    pub_date = models.DateTimeField('Date Published');
    #TODO: Implement zipfile upload to unpack and display an 'indexed' html page.


# Create your models here.
class ImageSet(models.Model):
    set_name = models.CharField(max_length=200)

    def __str__(self):
        return self.set_name

    # def filepath(self):
        # return STATIC_URL + '/amy/img/' + self.set_name + '_images/'

# https://docs.djangoproject.com/en/1.11/ref/models/fields/#django.db.models.FileField

from django.utils.safestring import mark_safe

class Image(models.Model):
    image_set =      models.ForeignKey(ImageSet, on_delete=models.CASCADE)
    # image = models.ImageField(upload_to=ImageSet.filepath, max_length=200)
    img =           models.ImageField(upload_to="amy/static/amy/image_sets/", max_length=200) #TODO: Modify
    name =          models.CharField(max_length=200)
    description =   models.CharField(max_length=200)

    def __str__(self):
        return self.name + ": '" + self.description + "'"



    def image_tag(self):
        return mark_safe(u'<img style="width:400px" src="%s" />' % ('/'+self.img.url[4:]))
    image_tag.short_description = 'Image'
