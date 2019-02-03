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

        #check that there this isn't already something created.
        if self.instance.id and self.instance.__class__.objects.filter(id=self.instance.id):
            #Existing instance, skip
            pass
        else:
            href = self.cleaned_data.get('href')
            title = self.cleaned_data.get('title')
            description = self.cleaned_data.get('description')
            pageapp = self.cleaned_data.get('pageapp')

            #If a new addition:
            subpage_template_path = BASE_DIR + "/" + subpageClass.name + "/templates/" + subpageClass.name + "/subpages/"
            #Check for the existance of other subpages
            if not os.path.isdir(subpage_template_path):
                os.mkdir(subpage_template_path)
            #Check for the existance of files for subpage:
            if os.path.isdir(subpage_template_path + title):
                counter = 1
                while os.path.isdir(subpage_template_path + title +'_'+ str(counter)):
                    counter+=1
                template_path = subpage_template_path + title +'_'+ str(counter)
            else:
                template_path = subpage_template_path + title

            #Setup new files
            os.mkdir(template_path)
            #add path to cleaned data
            self.cleaned_data['template_path'] = template_path
            self.instance.template_path = template_path

        return self.cleaned_data


class SubpageAdmin(admin.ModelAdmin):
    form = SubpageForm
    readonly_fields = ['template_path'] #allows the field to be displayed but not editable.
    list_display = ('title', 'pageapp', 'href', 'description', 'status', 'date_modified', 'date_created')

admin.site.register(Subpagebubble, SubpageAdmin)
