from pathlib import Path
from django.db import models
import datetime as dt
import os
from django.core.files import File
import uuid
from .music_analysis import CQT_Gzip


def convert_bytes(num): #https://stackoverflow.com/a/39988702/1717003
    """
    this function will convert bytes to MB.... GB... etc
    """
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0

class generalFile(models.Model):
    # filename = models.CharField(max_length=200)
    file = models.FileField()
    # original_filename = models.CharField(editable=False, max_length=200)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.file).split('/')[-1]

    def filesize_bytes(self):
        return os.path.getsize(str(self.file))

    def filesize(self):
        return convert_bytes(self.filesize_bytes())

class audioFile(generalFile):
    class Meta:
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
        if code is 0: #Successful compile.
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
        # Delete audio file from server:
        command = "rm " + self.file.path
        code = os.system(command)
        # Delete object
        super(audioFile,self).delete()
        return code


# Excellent reference for synchronising data and HTML audio/video element. 
# https://stackoverflow.com/questions/71204297/sync-an-html5-video-with-an-highchart-js-line-chart
# https://jsfiddle.net/BlackLabel/8a6yvjs5/

class publicAudioFile(audioFile):
    file = models.FileField(upload_to="photaMusic/static/photaMusic/publicTracks/")

    # def make_new_file(self):
    #     return publicAudioFile()

class photaAudioFile(audioFile):
    file = models.FileField(upload_to="photaMusic/static/photaMusic/photaTracks/")

    # def make_new_file(self):
    #     return photaAudioFile()

# Analysis Classes:
class CQT_gzip_file(generalFile):
    file = models.FileField(upload_to="photaMusic/static/photaMusic/gzip/")

# Create your models here.
class audioContainer(models.Model):
    """Object for an audio track and it's relevant information."""

    ### Necessary Fields & Properties:
    track_name = models.CharField(max_length=200)
    # file_audio = models.FileField()
    file_audio  = models.ForeignKey(
            'audioFile',
            on_delete=models.CASCADE
        )
    img = models.ImageField()

    date_uploaded = models.DateTimeField('Upload Date', auto_now_add=True)
    date_recorded = models.DateTimeField('Date Recorded', auto_now_add=True)

    ### Optional Fields & Properties:
    album = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    # Album Artist(s)?
    description = models.CharField(max_length=200)
    # Genre

    img = models.ImageField()

    # Analysis files
    cqt = models.OneToOneField(
            CQT_gzip_file,
            on_delete=models.CASCADE,
            # default = CQT_gzip_file()
    )

    class Meta: #Abstract class required to override attribute properties. https://stackoverflow.com/questions/2344751/
        abstract = True

    ### Methods:
    def __str__(self, *args, **kwargs):
        if (self.track_name != "" and self.artist != ""):
            return self.artist + " - " + self.track_name
        elif self.track_name != "":
            return "Unknown Artist - " + self.track_name
        elif self.artist != "":
            return self.artist + " - Untitled"
        return str(self.file_audio)

    def save(self,*args,**kwargs):
        if not self.file_audio.isMP3():
            raise AttributeError("File is not an mp3 format.")
        else:
            # Create CQT gzip file object
            self.cqt = CQT_gzip_file()
            # Generate CQT gzip file
            gzip_path = CQT_Gzip(self.file_audio.path)
            
            # Save file.
            gzipPath = Path(gzip_path)
            with gzipPath.open(mode="rb") as f:
                self.cqt = File(f, name=gzipPath.name)
                self.cqt.save()
            
            super(audioContainer,self).save(*args,**kwargs)



    def create_mp3_if_other(self):
        # TODO check if file already exists, and delete old file afterward (and model instance)
        input_path = self.file_audio.file_loc()
        print(input_path)
        output_path = "".join(input_path.split(".")[:-1]) + ".mp3"
        print(output_path)
        # Remove output_path if file already exists
        command = "rm " + output_path
        code = os.system(command)
        # Convert using FFMPEG
        command = "ffmpeg -i " +  input_path + " " + output_path
        code = os.system(command)
        if code is 0:
            # Create new track object:
            new_track = self.makeTrackObject()
            new_track.file.name=output_path
            new_track.save()
            # Remove copied input file & Replace with new.
            old_track = self.file_audio
            self.file_audio = new_track
            old_track.delete()
        else:
            pass

    def makeTrackObject(self, output_path):
        """REQUIRES IMPLEMENTATION IN SUPER"""
        raise Exception('Make Track function requires implementation for class.')

    def file_size(self):
        return self.file_audio.filesize()

    # Progressive FFT visualisation data.
    # Equivalent waveform representations that I can manipulate. {.mp3, .wav, .mp4, .m4p, etc} - Look at ffmpeg to see possible operations on files.
    # Delete Track

class publicTrack(audioContainer):
    expiry = models.DateTimeField('Expiry Time', default = dt.datetime.now() + dt.timedelta(hours=10))
    # file_audio = models.FileField(upload_to="photaMusic/static/photaMusic/publicTracks/")
    img = models.ImageField(upload_to="photaMusic/static/photaMusic/publicTracks/img/", max_length=200) #TODO: Modify
    file_audio  = models.ForeignKey(
            'publicAudioFile',
            on_delete=models.CASCADE
        )

    def makeTrackObject(self):
        # Create new track
        return publicAudioFile()

class photaTrack(audioContainer):
    # file_audio = models.FileField(upload_to="photaMusic/static/photaMusic/photaTracks/")
    img = models.ImageField(upload_to="photaMusic/static/photaMusic/photaTracks/img/", max_length=200)
    file_audio  = models.ForeignKey(
            'photaAudioFile',
            on_delete=models.CASCADE
        )

    def makeTrackObject(self):
        return photaAudioFile()

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
