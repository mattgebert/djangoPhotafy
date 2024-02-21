from pathlib import Path
from django.db import models
from django.dispatch import receiver
import datetime as dt
import os
from django.core.files import File
import uuid
from .models import audioContainer, filesize_bytes, filesize, convert_bytes
import soundfile as sf
import librosa
import numpy as np
import gzip
import json

class CQT_analysis(models.Model):
    """Base class for performing quantitative spectral analysis.
    """
    
    class Meta:
        abstract = True

    # Frequency Settings
    OCTAVES = 12 # number of octaves to span frequency data.
    BPO = 120 # bins per octave. (12 notes per octave, 10 divisions)
    NB = BPO*OCTAVES # number of bins
    FMIN = 5 # Min Freq Hz.
    TARGET_BIN_TIME = 0.25 # seconds
    
    # Amplitude Settings
    POW_SCALING = 0.3 # Post-normalization scaling.
    

class CQT_single_gzip(CQT_analysis):
    """Class to create a single file gzip to stream to a frontend."""
    
    class Meta:
        abstract = True
    
    # Gzip File object
    cqt_single_gzip_file = models.FileField(upload_to="photaMusic/static/photaMusic/cqt_single_gzip/", default=None)
    cqt_single_gzip_header = models.FileField(upload_to="photaMusic/static/photaMusic/cqt_single_gzip/", default=None)
    
    def filesize(self):
        
        return filesize(self.cqt_single_gzip_file.path) + filesize(self.cqt_single_gzip_file.path)
    
    def filesize_bytes(self):
        
        return
    
    def cqt_single_gzip_create(self):
        # Do nothing if object is 
        #       not an audio container 
        #       has no file attribute
        #       or has no audio file loaded.
        if not isinstance(self,audioContainer) or not hasattr(self, "file_audio")  or not self.file_audio:
            return
        
        # Generate path for new gzip file
        input_path = self.file_audio.file.path
        dir = os.path.dirname(input_path)
        filename = os.path.basename(input_path)
        
        # Create tmp directory for file conversion (saving disk file below will create a duplicate of this tmp file)
        tmp_dir = os.path.join(dir, "tmp")
        if not os.path.isdir(tmp_dir):
            os.mkdir(tmp_dir)
            
        # Create tmp filepath.
        output_path = os.path.join(tmp_dir, "".join(filename.split(".")[:-1]) + ".gzip")
        output_path_header = os.path.join(tmp_dir, "".join(filename.split(".")[:-1]) + "_header.gzip")
        
        # Check if file exists:
        while (os.path.isfile(output_path)):
            parts = output_path.split(".")
            output_path = "".join(parts[:-1]) + "_" + str(uuid.uuid4())[:8] + parts[-1]
        while (os.path.isfile(output_path_header)):
            parts = output_path_header.split(".")
            output_path_header = "".join(parts[:-1]) + "_" + str(uuid.uuid4())[:8] + parts[-1]

        # Get file information
        y, samplerate = sf.read(input_path)
        
        # Number of samples to process per cqt window.
        desiredHopLength = samplerate * self.TARGET_BIN_TIME 
        hopLength = int(desiredHopLength - desiredHopLength%2**9)
        binTime = hopLength / samplerate #actual bin time.
        
        # Use librosa to process the amplitude data over each hop.
        ycqtL = np.abs(librosa.cqt(y[:,0], hop_length = hopLength, 
                                   fmin=self.FMIN, sr=samplerate, 
                                   n_bins=self.NB, bins_per_octave=self.BPO))
        ycqtR = np.abs(librosa.cqt(y[:,0], hop_length = hopLength, 
                                   fmin=self.FMIN, sr=samplerate, 
                                   n_bins=self.NB, bins_per_octave=self.BPO))

        # RMS of left and right channels:
        ycqt = np.sqrt(ycqtL**2 + ycqtR**2)

        # Perform a time average over the cqt data, by 
        # coefCompFactor = 1
        # ycqtComp = np.sum(ycqt.reshape(ycqt.shape[0], -1, coefCompFactor), axis=2)
        
        # Normalize cqt data.
        ycqt_comp = ycqt / ycqt.max() #reduce to maximum 1
        ycqt_comp = np.power(ycqt_comp, self.POW_SCALING)
        
        # Scale to 0-255.
        ycqt_comp = np.around(ycqt_comp * 255)
        ycqt_comp = np.array(ycqt_comp, dtype=np.int8)
        
        # Construct json using time index and 
        dataOutput = [
            {"t":i,
             'spectra':j.tolist()
             } for i,j in zip(range(len(ycqt_comp)), ycqt_comp)
        ]
        header_info = {
            # Time divisions
            "time_delta" : binTime, 
            # Frequency Settings
            "octaves" : self.OCTAVES, 
            "bins_per_octave" : self.BPO,
            "number_bins" : self.NB,
            "freq_min" : self.FMIN
        }
        
        json_str = json.dumps(dataOutput, separators=(',',':'), sort_keys=True, indent=4)
        json_bytes = json_str.encode('utf-8')
        
        header_str = json.dumps(header_info, separators=(',',':'), sort_keys=True, indent=4)
        header_bytes = header_str.encode("utf-8")

        # Save output file to temp location
        with gzip.GzipFile(output_path, 'w') as fout:
            fout.write(json_bytes)
            
        with gzip.GzipFile(output_path_header, 'w') as fout:
            fout.write(header_bytes)
        
        # Save output file to disk.
        oPath = Path(output_path)
        oPath_header = Path(output_path_header)
        with (oPath.open(mode="rb"), oPath_header.open(mode="rb")) as files:
            f, head = files
            self.cqt_single_gzip_file = File(f, name=oPath.name)
            self.cqt_single_gzip_header = File(head, name=oPath_header.name)
            self.save()
        
        # Remove tmp file
        if output_path != self.cqt_single_gzip_file.path:
            os.remove(output_path)
        if len(os.listdir(tmp_dir)) == 0:
            os.remove(tmp_dir)  
            
        return
    
    def cqt_single_gzip_delete(self):
        if self.cqt_single_gzip_file:
            if os.path.isfile(self.cqt_single_gzip_file.path):
                os.remove(self.cqt_single_gzip_file.path)
            if os.path.isfile(self.cqt_single_gzip_header.path):
                os.remove(self.cqt_single_gzip_header.path)
        return
    
@receiver(models.signals.post_delete, sender=CQT_single_gzip)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.cqt_single_gzip_file:
        if os.path.isfile(instance.cqt_single_gzip_file.path):
            os.remove(instance.cqt_single_gzip_file.path)
        if os.path.isfile(instance.cqt_single_gzip_header.path):
            os.remove(instance.cqt_single_gzip_header.path)
    return
    
    
    