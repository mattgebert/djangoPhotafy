from django.contrib import admin

# Register your models here.

from .models import Image, ImageSet

class ImageInLine(admin.TabularInline):
    model = Image
    # fields = ("image_tag_icon",)
    readonly_fields = ("image_tag_icon",)


    # fieldsets = [
    #     (None, {"fields":["image_tag_icon",],}),
    # ]
    # readonly_fieldsets = [
    #     (None,{"readonly_fields":["image_tag_icon",]})
    # ]
    extra = 3



def deleteSelected(modeladmin, request, queryset):
    queryset.delete()
    return
deleteSelected.short_description="Remove selected images from ImageSet and delete."

class ImageSetAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields':['set_name']}),
    ]
    inlines = [ImageInLine]
    # actions = [deleteSelected]

    # def action_link(self, obj):
    #     app_name = obj._meta.app_label
    #     url_name = obj._meta.module_name
    #     data_id = obj.id
    #
    #     return """
    #          <ul>
    #             <li><a href="/admin/{0}/{1}/{2}">Edit</a></li>
    #             <li><a href="/admin/{0}/{1}/{2}/delete">Delete</a></li>
    #          </ul>
    #          """.format(
    #          obj._meta.app_label,
    #          obj._meta.module_name,
    #          obj.id)
    # action_link.allow_tags = True
    # action_link.short_description = 'Actions'

    class Media:
        js = ('amy/js/admin_image_preview.js',)
        cs = {
            "all":('amy/css/admin_image_preview.css')
        }




class ImageAdmin(admin.ModelAdmin):
    fields = ("image_tag","img","image_set","name","description")
    readonly_fields = ("image_tag",)
    list_filter = ('image_set',)
    # class Meta:
    pass



admin.site.register(ImageSet, ImageSetAdmin)
admin.site.register(Image, ImageAdmin)
