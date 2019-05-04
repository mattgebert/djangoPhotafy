from django.contrib import admin

# Register your models here.

from .models import Image, ImageSet

class ImageInLine(admin.TabularInline):
    model = Image
    fields = ("image_tag",)
    readonly_fields = ("image_tag",)
    extra = 3

class ImageSetAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields':['set_name']}),
    ]
    inlines = [ImageInLine]

class ImageAdmin(admin.ModelAdmin):
    fields = ("image_tag","img","image_set","name","description")
    readonly_fields = ("image_tag",)
    # class Meta:
    pass



admin.site.register(ImageSet, ImageSetAdmin)
admin.site.register(Image, ImageAdmin)
