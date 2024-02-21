import os
import numpy as np
import json, codecs
import itertools
import librosa

# CONVERT TO WAVE FOORMAT
# hydrogen:interrupt-kernel

# filename = "Phota - The Fifth Part.mp3"
# filename = "Ellie Goulding - Lights (Phota Remix).mp3"
filename = "Shepard Tone.mp3"
# dir_path = os.path.dirname(os.path.realpath(__file__))
dir_path = os.getcwd()
inputFilepath = dir_path + "/static/photaMusic/mp3/" + filename
outputFilepath = dir_path + "/static/photaMusic/output.wav"
inputFilepath = inputFilepath.replace(" ","\ ").replace("(","\(").replace(")","\)")
outputFilepath = outputFilepath.replace(" ","\ ")
# Remove old file:
command = "rm " + outputFilepath
os.system(command)
# Create new file:
command = "ffmpeg -i " +  inputFilepath + " " + outputFilepath
os.system(command)

# READ SEGMENTS OF DATA
import soundfile as sf

# Process FFT Data
data, samplerate = sf.read(outputFilepath)
blockTime = 0.1
blocksize = int(np.floor(blockTime*samplerate)) #Matches 0.25s worth of playing
blocksize

y = [block for block in sf.blocks(outputFilepath, blocksize=blocksize, overlap=0)]
# Average the left and right channels, take the magnitude of the complex values.
bpo=24;
nb=120;
fmin=5;
y[0].shape
yfftL = np.abs([librosa.cqt(block[:,0], fmin=fmin, sr=samplerate, n_bins=nb, bins_per_octave=bpo) for block in y])
yfftR = np.abs([librosa.cqt(block[:,1], fmin=fmin, sr=samplerate, n_bins=nb, bins_per_octave=bpo) for block in y])
yfftL.shape
yfftR.shape
yfft = (yfftL + yfftR)/2;
yfft = np.reshape(yfft,(yfft.shape[0]*yfft.shape[2],yfft.shape[1]))

# Force the smallest set of samples at the end to squish into a 3D matrix by padding.
if (yfft[-1].shape != yfft[-2].shape):
    zeros = np.zeros(yfft[-2].shape)
    zeros[:yfft[-1].shape[0]] = yfft[-1]
    yfft[-1] = zeros
yfft = np.stack(yfft, axis=0)
yfft.shape


# xfft = np.linspace(0.0, samplerate/2, int(blocksize/2))
xfft = librosa.cqt_frequencies(n_bins=nb, bins_per_octave=bpo, fmin=fmin)
xfft.size

# Data compression:
yfft = np.around(yfft.astype(np.float),decimals=2)
# Compress data: need to combine left and right data, and reduce size of spectral density. Do this by summing coefficients within sub range. File size is currently 800MB --> using LR combo to 500MB, need factor 10 mminimum. So... typical 1080P res monitor, only can have 1080 pixels of data --> 11025/1080 = ~ 10 compresion. 50MB of data seems OK?
# Truncate to be a multiple of 10 elements
truncateFactor = 10;
yfftsm = yfft[::,0:yfft.shape[1]-yfft.shape[1]%truncateFactor]
yfftsm.shape
# Sum every 10 elements
coefCompFactor = 1;
yfftComp = np.sum(yfftsm.reshape(yfftsm.shape[0],-1,coefCompFactor), axis=2)
yfftComp = np.around(yfftComp,decimals=2)
yfftComp.shape

# Cast xfft array to the same size too
# xfft.shape
xfftsm = xfft[0:xfft.shape[0] - xfft.shape[0]%truncateFactor]
xfftsm.shape
xfftComp = xfftsm[::coefCompFactor]
xfftComp.shape
xfftComp = np.around(xfftComp.astype(np.float),decimals=2)
# Calculate max array values:
max = yfftComp.max()

# Generate timestamps
timestamps = np.array([blockTime * i for i in range(0,yfftComp.shape[0])])
timestamps.shape
timestamps[-1]

# Write json file: make a dict in python.
dataOutput = [{'t':i,'spectra':j.tolist()} for i,j in zip(timestamps,yfftComp)]
analysisOutputPath = dir_path + '/static/photaMusic/data.json'

output = {'xaxis':xfftComp.tolist(), "blockTime":blockTime,"max":max,"data":dataOutput}
json.dump(output, codecs.open(analysisOutputPath, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4)

os.system("firefox " + dir_path + "/static/photaMusic/freqView.html")

xfftComp.shape

%matplotlib inline
import matplotlib.pyplot as plt
fig = plt.figure()
ax = plt.axes()
ax.set_xscale('log',basex=10)
ax.plot(xfftComp, 2.0/blocksize * yfftComp[500][:]) #Plot Left
plt.show()
