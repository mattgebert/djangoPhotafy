from django.contrib import admin

# Register your models here.
from .models import Socialprofile, Subpagebubble
from django import forms
from django.contrib import admin
from photaHome.pageapps import get_pageapp, get_pageapp_classes
from djangoPhotafy.settings import BASE_DIR
import os

admin.site.register(Socialprofile)

pageapp_classes = get_pageapp_classes()

class SubpageForm(forms.ModelForm):
    class Meta:
        model = Subpagebubble
        fields = ('href', 'title', 'description', 'pageapp', 'template_path', 'status')

    def clean(self):
        super().clean()
        href = self.cleaned_data.get('href')
        title = self.cleaned_data.get('title')
        description = self.cleaned_data.get('description')
        pageapp = self.cleaned_data.get('pageapp')

        subpageClass = None
        #Match the selected pageape
        for klass in pageapp_classes:
            if klass.name == pageapp:
                subpageClass = klass
        if subpageClass is None:
            raise forms.ValidationError("A Pageapp needs to be selected.")

class SubpageAdmin(admin.ModelAdmin):
    form = SubpageForm
    readonly_fields = ['template_path'] #allows the field to be displayed but not editable.
    list_display = ('title', 'pageapp', 'href', 'description', 'status', 'date_modified', 'date_created')

admin.site.register(Subpagebubble, SubpageAdmin)


#TODO: make a interface to scan static directory for unlinked pages, and choose to upload them (tick boxes). This means content can be deleted from the website without affecting github, and added later, remotely through git.
