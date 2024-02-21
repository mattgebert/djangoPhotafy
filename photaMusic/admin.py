from django.contrib import admin
from django import forms

from .models import publicTrack, photaTrack, audioContainer, baseVisualisationTrack

class trackForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(trackForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].required = False
        self.fields['file'].required = True
        self.fields['track_name'].required = True


class trackAdmin(admin.ModelAdmin):
    fields = ['artist','track_name','file','filesize']
    readonly_fields = ('filesize',)
    list_display = ('track_name','artist','file','filesize')

    #Obj param required for creating a field.
    def filesize(self,obj):
        return obj.filesize()
    filesize.empty_value_display = '???'
    
    class Meta:
        model = audioContainer
        
class visualTrackAdmin(trackAdmin):
    visual_fields = ("cqt_single_gzip_file","cqt_single_gzip_header")
    fields = trackAdmin.fields + list(visual_fields)
    readonly_fields = tuple(list(trackAdmin.readonly_fields) + list(visual_fields))
    list_display = tuple(list(trackAdmin.list_display) + list(visual_fields))
    
    class Meta:
        model = baseVisualisationTrack

# class visualTrackForm(trackForm):
#     def __init__(self, *args, **kwargs):
#         super(visualTrackForm, self).__init__(*args, **kwargs)
#         for field in self.visual_fields:
#             self.fields[field].required = False
#         self.fields['file'].required = True
#         self.fields['track_name'].required = True
    

class photaTrackForm(trackForm):
    class Meta:
        fields = ['file','track_name','artist']
        model = photaTrack

    # def __init__(self, *args, **kwargs):
        # super(photaTrackForm, self).__init__(*args, **kwargs)

@admin.register(photaTrack)
class AddPhotaTrack(visualTrackAdmin):
    form = photaTrackForm
    change_form_template = "admin/photaMusic/baseVisualisationTrack/change_form.html"

class publicTrackForm(trackForm):

    class Meta:
        # fields = ["img", 'fileAudio']
        fields = ['file','track_name','artist','expiry']
        model = publicTrack

    def __init__(self, *args, **kwargs):
        super(publicTrackForm, self).__init__(*args, **kwargs)
        self.fields['expiry'].widget.attrs['readonly'] = True
        self.fields['expiry'].widget.attrs['disabled'] = True
        self.fields['expiry'].disabled = True
        self.fields['expiry'].readonly = True

@admin.register(publicTrack)
class AddPublicTrack(visualTrackAdmin):
    form = publicTrackForm

# admin.site.register(publicTrack, publicTrackInLine)
# admin.site.register(playlist, playlistAdmin)
# admin.site.register(photaTrack, AddPhotaTrack)
# admin.site.register(publicTrack, AddPublicTrack)


def convert_bytes(num): #https://stackoverflow.com/a/39988702/1717003
    """
    this function will convert bytes to MB.... GB... etc
    """
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
