import os
import numpy as np
import json, codecs
import itertools

# CONVERT TO WAVE FOORMAT
# hydrogen:interrupt-kernel

# filename = "Phota - The Fifth Part.mp3"
filename = "Ellie Goulding - Lights (Phota Remix).mp3"
# dir_path = os.path.dirname(os.path.realpath(__file__))
dir_path = os.getcwd()
inputFilepath = dir_path + "/static/photaMusic/" + filename
outputFilepath = dir_path + "/static/photaMusic/output.wav"
inputFilepath = inputFilepath.replace(" ","\ ").replace("(","\(").replace(")","\)")
outputFilepath = outputFilepath.replace(" ","\ ")
command = "ffmpeg -i " +  inputFilepath + " " + outputFilepath
print(command)
os.system(command)

# READ SEGMENTS OF DATA
import soundfile as sf

# Process FFT Data
data, samplerate = sf.read(outputFilepath)
blockTime = 0.1
blocksize = int(np.floor(blockTime*samplerate)) #Matches 0.25s worth of playing
blocksize

yfft = [(np.fft.rfft(block)) for block in
       sf.blocks(outputFilepath, blocksize=blocksize, overlap=512, always_2d=True)]
xfft = np.linspace(0.0, samplerate/2, int(blocksize))

yfft = np.abs(yfft);

# Force the smallest set of samples at the end to squish into a 3D matrix by padding.
if (yfft[-1].shape != yfft[-2].shape):
    zeros = np.zeros(yfft[-2].shape)
    zeros[:yfft[-1].shape[0],:yfft[-1].shape[1]] = yfft[-1]
    yfft[-1] = zeros
yfft = np.stack(yfft, axis=0)
yfft.shape

# %matplotlib inline
# import matplotlib.pyplot as plt
# fig = plt.figure()
# ax = plt.axes()
# ax.plot(xfft, 2.0/blocksize * np.abs(yfft[2][:,0])) #Plot Left
# plt.show()

yfft = np.around(yfft.astype(np.float),decimals=2)
# Compress data: need to combine left and right data, and reduce size of spectral density. Do this by summing coefficients within sub range. File size is currently 800MB --> using LR combo to 500MB, need factor 10 mminimum. So... typical 1080P res monitor, only can have 1080 pixels of data --> 11025/1080 = ~ 10 compresion. 50MB of data seems OK?
yfft2 = np.mean(yfft,2)
# Truncate to be a multiple of 10 elements
coefCompFactor = 20;
yfft2.shape
yfft2subset = yfft2[::,0:yfft2.shape[1]-yfft2.shape[1]%coefCompFactor]
yfft2subset.shape
# Sum every 10 elements
yfft3 = np.sum(yfft2subset.reshape(yfft2subset.shape[0],-1,coefCompFactor), axis=2)
yfft3.shape
yfft3 = np.around(yfft3,decimals=2)

# Cast xfft array to the same size too
xfft.shape
xfft2 = xfft[0:xfft.shape[0] - xfft.shape[0]%coefCompFactor]
xfft2.shape
xfft3 = xfft2[::coefCompFactor]
xfft3.shape
xfft3 = np.around(xfft.astype(np.float),decimals=2)

# Calculate max array values:
max = yfft3.max()

# Generate timestamps
timestamps = np.array([blockTime * i for i in range(0,yfft3.shape[0])])
timestamps.shape

# Write json file: make a dict in python.
dataOutput = [{'t':i,'spectra':j.tolist()} for i,j in zip(timestamps,yfft3)]
analysisOutputPath = dir_path + '/static/photaMusic/data.json'

output = {'xaxis':xfft3.tolist(), "blockTime":blockTime,"max":max,"data":dataOutput}
json.dump(output, codecs.open(analysisOutputPath, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4)

os.system("firefox " + dir_path + "/static/photaMusic/freqView.html")
