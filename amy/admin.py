from django.contrib import admin

# Register your models here.

from .models import Image, ImageSet

class ImageInLine(admin.TabularInline):
    model = Image
    extra = 3

class ImageSetAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields':['set_name']}),
    ]
    inlines = [ImageInLine]


admin.site.register(ImageSet, ImageSetAdmin)
admin.site.register(Image)
