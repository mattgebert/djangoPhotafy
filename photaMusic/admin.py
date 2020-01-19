from django.contrib import admin
from django import forms

from .models import publicTrack, photaTrack, publicAudioFile, photaAudioFile, playlist, audioContainer
from .models import publicAudioFile, photaAudioFile, audioFile
# class audioFileInLine(admin.TabularInline):
#     model = audioFile
#     extra = 3
#
# class playlistAdmin(admin.ModelAdmin):
#     fieldsets = [
#         (None, {'fields':['track_name']}),
#     ]
#     inlines = [audioFileInLine]

class audioFileForm(forms.ModelForm):
    class Meta:
        # fields = ["img", 'fileAudio']
        fields = ['file']
        model = audioFile

class audioFileAdmin(admin.ModelAdmin):
    def delete_queryset(self, request, queryset):
        successes = 0
        for obj in queryset:
            retCode = obj.delete()
            if retCode == 0:
                successes += 1
        self.message_user(request, "%s successfully deleted." % successes)
    delete_queryset.short_description = "Delete selected Phota Audio Files"

    model = audioFile
    actions = [delete_queryset] #TODO TEST


class trackForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(trackForm, self).__init__(*args, **kwargs)
        for field in self.fields:
            self.fields[field].required = False
        self.fields['file_audio'].required = True
        self.fields['track_name'].required = True


class trackAdmin(admin.ModelAdmin):
    fields = ['file_audio','track_name','artist','file_size']
    readonly_fields = ('file_size',)
    list_display = ('file_audio','track_name','artist','file_size')

    #Obj param required for creating a field.
    def file_size(self,obj):
        return obj.file_size()
    file_size.empty_value_display = '???'


    class Meta:
        model = audioContainer
    # def filesize(self):
    #     print(self.file_audio)
    #     return convert_bytes(os.path.getsize(os.getcwd() + str(self.file_audio)))
    # filesize.empty_value_display = "???"


class photaTrackForm(trackForm):
    class Meta:
        fields = ['file_audio','track_name','artist']
        model = photaTrack

    # def __init__(self, *args, **kwargs):
        # super(photaTrackForm, self).__init__(*args, **kwargs)

class AddPhotaTrack(trackAdmin):
    form = photaTrackForm

class publicTrackForm(trackForm):

    class Meta:
        # fields = ["img", 'fileAudio']
        fields = ['file_audio','track_name','artist','expiry']
        model = publicTrack

    def __init__(self, *args, **kwargs):
        super(publicTrackForm, self).__init__(*args, **kwargs)
        self.fields['expiry'].widget.attrs['readonly'] = True
        self.fields['expiry'].widget.attrs['disabled'] = True
        self.fields['expiry'].disabled = True
        self.fields['expiry'].readonly = True

class AddPublicTrack(trackAdmin):
    form = publicTrackForm



# admin.site.register(publicTrack, publicTrackInLine)
# admin.site.register(playlist, playlistAdmin)
admin.site.register(photaTrack, AddPhotaTrack)
admin.site.register(publicTrack, AddPublicTrack)
# admin.site.register(audioFile)
admin.site.register(publicAudioFile, audioFileAdmin)
admin.site.register(photaAudioFile, audioFileAdmin)




def convert_bytes(num): #https://stackoverflow.com/a/39988702/1717003
    """
    this function will convert bytes to MB.... GB... etc
    """
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
