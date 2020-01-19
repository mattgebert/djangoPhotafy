from django.db import models
import datetime as dt
import os
from django.core.files import File
import uuid
from .music_analysis import CQT_Gzip

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

    def file_loc(self):
        return str(self.file)

class audioFile(generalFile):
    class Meta:
        abstract = True

    # def unique_file_path(instance, filename):
    #     # Save original file name in model
    #     instance.original_file_name = filename
    #
    #     # Get new file name/upload path
    #     base, ext = splitext(filename)
    #     newname = "%s%s" % (uuid.uuid4(), ext)
    #     return os.path.join('photos', newname)

    def save(self, *args, **kwargs):
        # self.original_filename = str(self.file)
        super(audioFile,self).save(*args,**kwargs)
        if not self.isMP3():
            self.convert_to_MP3()

    def isMP3(self):
        """Allow checking if file saved is mp3 format."""
        if(self.file_loc().split(".")[-1] != "mp3"):
            return False
        else:
            return True

    def convert_to_MP3(self):
        # Generate path for new file
        input_path = self.file_loc().replace(" ", "\ ")
        output_path = "".join(input_path.split(".")[:-1]) + ".mp3"

        # Check if file exists:
        while (os.path.isfile(output_path)):
            output_path = output_path.split(".")[:-1] + "_" + str(uuid.uuid4())[:8]

        # Remove output_path if file already exists
        # command = "rm " + output_path
        # code = os.system(command)

        # Convert using FFMPEG
        command = "ffmpeg -i " +  input_path + " " + output_path
        code = os.system(command)
        if code is 0: #Successful compile.
            # Create new track object:
            self.file.name=output_path
            self.save()
            # Remove old file.
            command = "rm " + input_path
            code = os.system(command)

    def clone_self_as_MP3(self):
        # Define new track object
        new_track = self.make_new_file()
        # Generate path for new file
        input_path = self.file_loc().replace(" ", "\ ")
        output_path = "".join(input_path.split(".")[:-1]) + ".mp3"

        # Check if file exists:
        while (os.path.isfile(output_path)):
            output_path = output_path.split(".")[:-1] + "_" + str(uuid.uuid4())[:8]

        # Remove output_path if file already exists
        command = "rm " + output_path
        code = os.system(command)
        # Convert using FFMPEG
        command = "ffmpeg -i " +  input_path + " " + output_path
        code = os.system(command)
        if code is 0: #Successful compile.
            # Create new track object:
            new_track.name=output_path
            new_track.save()
            return
        else:
            raise Exception("" + self.file + " not successfully cloned as .mp3 with FFMPEG.")

    def makeNewFile(self, output_path):
        """REQUIRES IMPLEMENTATION IN SUPER"""
        raise Exception('Make Track function requires implementation for class.')

    def delete(self):
        # Delte audio file from server:
        command = "rm " + self.file_loc()
        code = os.system(command)
        # Delete object
        super(audioFile,self).delete()
        return code

class publicAudioFile(audioFile):
    file = models.FileField(upload_to="photaMusic/static/photaMusic/publicTracks/")

    def make_new_file(self):
        return publicAudioFile()

class photaAudioFile(audioFile):
    file = models.FileField(upload_to="photaMusic/static/photaMusic/photaTracks/")

    def make_new_file(self):
        return photaAudioFile()

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
        if(str(self.file_audio).split(".")[-1] != "mp3"):
            print("File is not an mp3 format. Converting with FFMPEG...")
            self.create_mp3_if_other()

            # Create CQT gzip file.
            self.cqt = CQT_gzip_file()
            self.cqt.file = CQT_Gzip(self.file_audio.file_loc())

            super(audioContainer,self).save(*args,**kwargs)
        else:
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



def convert_bytes(num): #https://stackoverflow.com/a/39988702/1717003
    """
    this function will convert bytes to MB.... GB... etc
    """
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if num < 1024.0:
            return "%3.1f %s" % (num, x)
        num /= 1024.0
