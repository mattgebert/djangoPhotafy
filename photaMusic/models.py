from pathlib import Path
from django.db import models
import datetime as dt
import os
from django.core.files import File
from django.dispatch import receiver
import uuid

def convert_bytes(num): #https://stackoverflow.com/a/39988702/1717003
    """
    this function will convert bytes to MB.... GB... etc
    """
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
def filesize_bytes(path):
    return os.path.getsize(path)
def filesize(path):
    return convert_bytes(filesize_bytes(path))


class generalFile(models.Model):
    file = models.FileField(default=None)
    id = models.AutoField(primary_key=True)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.file).split('/')[-1]
    
    
        
    def filesize_bytes(self):
        return os.path.getsize(self.file.path) if self.file else None

    def filesize(self):
        return convert_bytes(self.filesize_bytes()) if self.file else None

    

@receiver(models.signals.post_delete)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if issubclass(sender, generalFile):
        if instance.file:
            if os.path.isfile(instance.file.path):
                os.remove(instance.file.path)
    return

@receiver(models.signals.pre_save) #sender = generalFile
def auto_delete_file_on_save(sender, instance, **kwargs):
    if issubclass(sender, generalFile):
        if not instance.pk:
            return
        inst_type = type(instance)
        try:
            old_file = inst_type.objects.get(pk=instance.pk).file
        except inst_type.DoesNotExist:
            return False
        new_file = instance.file
        if not old_file == new_file:
            if os.path.isfile(old_file.path):
                os.remove(old_file.path)
    

class audioFile(generalFile):
    class Meta:
        # Requires class to be public or private track.
        abstract = True

    def save(self, *args, **kwargs):
        # self.original_filename = str(self.file)
        super(audioFile,self).save(*args,**kwargs)
        if not self.isMP3():
            self.convert_to_MP3()

    def isMP3(self):
        """Allow checking if file saved is mp3 format."""
        if(self.file.path.split(".")[-1] != "mp3"):
            return False
        else:
            return True

    def convert_to_MP3(self):
        # Generate path for new file
        input_path = self.file.path
        dir = os.path.dirname(input_path)
        filename = os.path.basename(input_path)
        
        # Create tmp directory for file conversion (saving disk file below will create a duplicate of this tmp file)
        tmp_dir = os.path.join(dir, "tmp")
        if not os.path.isdir(tmp_dir):
            command = "mkdir " + tmp_dir
            os.system(command)
            
        # Create tmp conversion filepath.
        output_path = os.path.join(tmp_dir, "".join(filename.split(".")[:-1]) + ".mp3")
        
        # Check if file exists:
        while (os.path.isfile(output_path)):
            output_path = output_path.split(".")[:-1] + "_" + str(uuid.uuid4())[:8]

        # Convert using FFMPEG
        command = "ffmpeg -i " +  input_path + " " + output_path
        code = os.system(command)
        if code == 0: #Successful compile.
            # Create new track object - note this also generates a new clone of the file in static - hence we created
            oPath = Path(output_path)
            with oPath.open(mode="rb") as f:
                self.file = File(f, name=oPath.name)
                self.save()
            
            # Remove old file.
            command = "rm " + input_path
            code = os.system(command)
            
            # Remove tmp file
            if output_path != self.file.path:
                command = "rm " + output_path
                code = os.system(command)
                   
    def delete(self):
        print("Deleting files.")
        # Delete audio file from server:
        command = "rm " + self.file.path
        code = os.system(command)
        # Delete object
        super(audioFile,self).delete()
        return code

class audioContainer(audioFile):
    class Meta:
        # Requires use of visualisation track.
        abstract = True
        
    """Object for an audio track and it's relevant information."""

    ### Necessary Fields & Properties:
    track_name = models.CharField(max_length=200)

    date_uploaded = models.DateTimeField('Upload Date', auto_now_add=True)
    date_recorded = models.DateTimeField('Date Recorded', auto_now_add=True)

    ### Optional Fields & Properties:
    album = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    # Album Artist(s)?
    description = models.CharField(max_length=200)
    # Genres
    
    # Icon art
    icon = models.ImageField(default=None)
    banner = models.ImageField(default=None)

    class Meta: #Abstract class required to override attribute properties. https://stackoverflow.com/questions/2344751/
        abstract = True

    ### Methods:
    def __str__(self, *args, **kwargs):
        """ Generate string in the form: 
                "Matt Gebert: Progress <filename>"
        """
        retStr = ""
        retStr += self.artist if self.artist != "" else "Unknown Artist"
        retStr += ": "
        retStr += self.track_name if self.track_name != "" else "Untitled"
        retStr += " <"
        retStr += str(self.file) + ">"
        return retStr

# Excellent reference for synchronising data and HTML audio/video element. 
# https://stackoverflow.com/questions/71204297/sync-an-html5-video-with-an-highchart-js-line-chart
# https://jsfiddle.net/BlackLabel/8a6yvjs5/

from .models_visualisation import *
class baseVisualisationTrack(audioContainer, CQT_single_gzip):
    def __init__(self, *args, **kwargs) -> None:
        super(audioContainer, self).__init__(*args, **kwargs)
        super(CQT_single_gzip, self).__init__(*args, **kwargs)
    
    class Meta:
        abstract = True 

    def generate_visualisations(self):
        """Generate visualisation elements for subclasses"""
        if issubclass(self, CQT_single_gzip):
            CQT_single_gzip.cqt_single_gzip_create(self)
    
    def remove_visualisations(self):
        """Remove visualisation elements for subclasses"""
        if issubclass(self, CQT_single_gzip):
            CQT_single_gzip.cqt_single_gzip_delete(self)

@receiver(models.signals.post_save)
def regenerate_visualisation(sender, instance, created, **kwargs):
    """Function to handle visualisation generation after model save."""
    # Requires subclasses to generate files.
    if issubclass(sender, baseVisualisationTrack):
        # If new instance, definitely generate visual elements. 
        if created:
            baseVisualisationTrack.generate_visualisations(instance)
        
        # Otherwise, if audio file changes, regenerate.
        elif instance.pk:
            inst_type = type(instance)
            try:
                old_file = inst_type.objects.get(pk=instance.pk).file
            except inst_type.DoesNotExist:
                return False
            new_file = instance.file
            if not old_file == new_file:
                # Remove old visualisations
                baseVisualisationTrack.remove_visualisations(instance)
                # Generate new visualisations
                baseVisualisationTrack.generate_visualisations(instance)

class publicTrack(baseVisualisationTrack):
    expiry = models.DateTimeField('Expiry Time', default = dt.datetime.now(tz=dt.timezone.utc) + dt.timedelta(hours=1))
    
    file = models.FileField(upload_to="photaMusic/publicTracks/")
    img = models.ImageField(upload_to="photaMusic/publicTracks/img/", max_length=200) #TODO: Modify

class photaTrack(baseVisualisationTrack):
    
    file = models.FileField(upload_to="photaMusic/photaTracks/")
    img = models.ImageField(upload_to="photaMusic/photaTracks/img/", max_length=200)

class playlist(models.Model):
    """Object for a list of @audio objects. Can be a playlist or an album etc"""
    id = models.AutoField(primary_key=True)
    
    #Set Name
    #Description
    #IsAlbum?
    #Playlist Creator (same as Album Artist

    ### Methods:
    # Upload Filelist
    # Delete Playlist
    # Remove Track
    # Add Track
