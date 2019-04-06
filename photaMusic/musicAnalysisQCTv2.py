import os
import numpy as np
import json, codecs
import itertools
import librosa

# CONVERT TO WAVE FOORMAT
# hydrogen:interrupt-kernel

filename = "Phota - The Fifth Part.mp3"
# filename = "Ellie Goulding - Lights (Phota Remix).mp3"
# filename = "Shepard Tone.mp3"
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
y, samplerate = sf.read(outputFilepath)
# Need to select bins such that we have enough octaves to span from low freq (5hz) to 44100 Hz (Minimum 8 octaves?)
octaves = 12;
bpo=20 #bins per octave
nb=bpo*octaves #number of bins
fmin=5 #frequency minimum
# number of samples is: duration * samplerate / hop_length
300*samplerate/hopLength

binTime = 0.1;
desiredHopLength = samplerate * binTime
hopLength = int(desiredHopLength - desiredHopLength%2**9)
binTime = hopLength / samplerate
binTime

yfftL = np.abs(librosa.cqt(y[:,0], hop_length = hopLength, fmin=fmin, sr=samplerate, n_bins=nb, bins_per_octave=bpo))
yfftR = np.abs(librosa.cqt(y[:,1], hop_length = hopLength, fmin=fmin, sr=samplerate, n_bins=nb, bins_per_octave=bpo))
yfftL.shape
yfftR.shape
# Average the left and right channels, take the magnitude of the complex values.
yfft = (yfftL + yfftR)/2;
yfft.shape


# Force the smallest set of samples at the end to squish into a 3D matrix by padding.
if (yfft[-1].shape != yfft[-2].shape):
    zeros = np.zeros(yfft[-2].shape)
    zeros[:yfft[-1].shape[0]] = yfft[-1]
    yfft[-1] = zeros
yfft = np.stack(yfft, axis=0)
yfft.shape
# Rotate data:
yfft=yfft.T
yfft.shape

# Get corresponding cqt bins
xfft = librosa.cqt_frequencies(n_bins=nb, bins_per_octave=bpo, fmin=fmin)
xfft.size

# Data compression:... do later...
# yfft = np.around(yfft.astype(np.float),decimals=2)
# xfft = np.around(xfft.astype(np.float),decimals=2)

# Truncate to be a multiple of 10 elements
truncateFactor = 10;
yfftsm = yfft[::,0:yfft.shape[1]-yfft.shape[1]%truncateFactor]
yfftsm.shape


#   Calculate sums
# coefCompFactor = int(np.round(desiredBlockTime/blockTime))
coefCompFactor=1;
yfftComp = np.sum(yfftsm.reshape(yfftsm.shape[0],-1,coefCompFactor), axis=2)
yfftComp.shape

# Cast xfft array to the same size too
xfftsm = xfft[0:xfft.shape[0] - xfft.shape[0]%truncateFactor]
xfftsm.shape
xfftComp = xfftsm[::coefCompFactor]
xfftComp.shape
# Calculate max array values:
max = yfftComp.max()

# Normalize coefficients:
yfftComp = yfftComp / max;
yfftComp = np.power(yfftComp,0.3)
# yfftComp = np.sqrt(yfftComp)
max=1
yfftComp = np.around(yfftComp,decimals=2)
xfftComp = np.around(xfftComp,decimals=2)

# Generate timestamps
timestamps = np.array([binTime * i for i in range(0,yfftComp.shape[0])])
timestamps.shape
timestamps[-1]

# Write json file: make a dict in python.
dataOutput = [{'t':i,'spectra':j.tolist()} for i,j in zip(timestamps,yfftComp)]
analysisOutputPath = dir_path + '/static/photaMusic/data.json'

output = {'xaxis':xfftComp.tolist(), "blockTime":binTime,"max":max,"data":dataOutput}
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
