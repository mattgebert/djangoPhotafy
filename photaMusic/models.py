from django.db import models

# Create your models here.
class audio(models.Model):
    """Object for an audio track and it's relevant information."""

    ### Necessary Fields & Properties:
    #uploaded file object - # https://docs.djangoproject.com/en/1.11/ref/models/fields/#django.db.models.FileField
    #track name
    #date published --> Inherently generated
    #date recorded

    ### Optional Fields & Properties:
    # album
    # Artist(s)
    # Album Artist(s)
    # Description
    # Track Image
    # Genre

    ### Methods:
    # Progressive FFT visualisation data.
    # Equivalent waveform representations that I can manipulate. {.mp3, .wav, .mp4, .m4p, etc} - Look at ffmpeg to see possible operations on files.
    # Delete Track

class playlist(models.Model):
    """Object for a list of @audio objects. Can be a playlist or an album etc"""
    #Set Name
    #Description
    #IsAlbum?
    #Playlist Creator (same as Album Artist



    ### Methods:
    # Upload Filelist
    # Delete Playlist
    # Remove Track
    # Add Track




    # set_name = models.CharField(max_length=200)
    #
    # def __str__(self):
    #     return self.set_name
    #
    # # def filepath(self):
    #     # return STATIC_URL + '/amy/img/' + self.set_name + '_images/'
    #
    #
    # image_set =      models.ForeignKey(ImageSet, on_delete=models.CASCADE)
    # # image = models.ImageField(upload_to=ImageSet.filepath, max_length=200)
    # img =           models.ImageField(upload_to="amy/static/amy/image_sets/", max_length=200)
    # name =          models.CharField(max_length=200)
    # description =   models.CharField(max_length=200)
    #
    # def __str__(self):
    #     return self.name + ": '" + self.description + "'"
