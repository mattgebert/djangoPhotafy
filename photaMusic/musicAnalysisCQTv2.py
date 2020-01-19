import os
import numpy as np
import json, codecs
import itertools
import librosa

# CONVERT TO WAVE FOORMAT
# hydrogen:interrupt-kernel

# filename = "Phota - The Fifth Part.mp3"
filename = "Ellie Goulding - Lights (Phota Remix).mp3"
# filename = "Shepard Tone.mp3"
# filename = "11 - Bulletproof.ogg"
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
octaves = 12
bpo=120 #bins per octave
nb=bpo*octaves #number of bins
fmin=5 #frequency minimum

binTime = 0.03
desiredHopLength = samplerate * binTime
desiredHopLength
2**9
hopLength = int(desiredHopLength - desiredHopLength%2**9)
binTime = hopLength / samplerate
binTime

# number of samples is: duration * samplerate / hop_length
300*samplerate/hopLength

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

yfftCompFurther = yfftComp.copy();
count = 0;
prevVals = yfftComp[0];
for i in range(1,yfftComp.shape[0]):
    for j in range(1, yfftComp.shape[1]):
        if prevVals[j] == yfftComp[i,j]:
            yfftCompFurther[i,j] = None
            count+=1
        else:
            prevVals[j] = yfftComp[i,j]


# Write json file: make a dict in python.
dataOutput = [{'t':i,'spectra':j.tolist()} for i,j in zip(timestamps,yfftComp)]
analysisOutputPath = dir_path + '/static/photaMusic/data_new.json'

output = {'xaxis':xfftComp.tolist(), "blockTime":binTime,"max":max,"data":dataOutput}
json.dump(output, codecs.open(analysisOutputPath, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4)
json_str = json.dumps(output, separators=(',', ':'), sort_keys=True, indent=4)
json_bytes = json_str.encode('utf-8')

import gzip
analysisOutputPath2 = dir_path + '/static/photaMusic/data_new.gzip'
with gzip.GzipFile(analysisOutputPath2, 'w') as fout:
    fout.write(json_bytes)

os.system("firefox " + dir_path + "/static/photaMusic/freqView.html")

# Generate an amplitude graph
duration = len(y) / samplerate
snipTime = duration/1000; #seconds - divide song evently.
snipBins = int(np.round(snipTime/binTime))
samplesToAverage = int(np.round(duration / snipTime))
timeSamples = np.linspace(0,duration,snipBins);
yfftComp.shape

amplitudeSnips = np.stack([np.sum(np.sum(yfftComp.T[0+b:samplesToAverage+b,::],axis=1)) for b in range(0,snipBins)])
# amplitudeSnips = np.stack([np.average(np.sum(yfftComp[0+b:samplesToAverage+b,::],axis=1)) for b in range(0,snipBins)])
amplitudeSnips = np.stack([np.sum(np.sum(np.greater(yfftComp[0+b:samplesToAverage+b,::],0.6),axis=0),axis=0) for b in range(0,snipBins)])
np.max(amplitudeSnips)


yfftComp.shape
yfftComp[0:samplesToAverage,::];
yfftComp[0:samplesToAverage,::].shape
[np.average(np.average(yfftComp[0+b:samplesToAverage+b,::],axis=1)) for b in range(0,snipBins)]
yfftComp[0,400]
np.greater(yfftComp,0.2);
np.sum(np.greater(yfftComp,0.1))

%matplotlib inline
import matplotlib.pyplot as plt

factor = 60;
rms = [np.sqrt(np.mean(block**2)) for block in sf.blocks('static/photaMusic/output.wav', blocksize=1024*factor, overlap=512*factor)]
rms = np.stack(rms)
rms.size

# Gaussian convolve:
def gaussianFilter(array1d, length, iterations=1):
    # Define pre-established values.
    gaussianCoeffs7 = [0.00443305, 0.0540056, 0.242036, 0.39905, 0.242036, 0.0540056, 0.00443305]
    gaussianCoeffs9 = [0.0012344, 0.0143047, 0.0823178, 0.235236, 0.333815, 0.235236, 0.0823178, 0.0143047, 0.0012344]
    gaussianCoeffs15 = [0.00132952, 0.0048784, 0.0146555, 0.0360468, 0.0725893, 0.11968, 0.16155, 0.178541, 0.16155, 0.11968, 0.0725893, 0.0360468, 0.0146555, 0.0048784, 0.00132952]
    gaussianCoeffs21 = [0.000850764, 0.00219983, 0.00514682, 0.0108958, 0.0208714, 0.0361754, 0.0567344, 0.0805099, 0.103377,
    0.120107, 0.126265, 0.120107, 0.103377, 0.0805099, 0.0567344, 0.0361754, 0.0208714, 0.0108958, 0.00514682, 0.00219983, 0.000850764]
    coefList = {7:gaussianCoeffs7,9:gaussianCoeffs9,15:gaussianCoeffs15,21:gaussianCoeffs21}
    # Choose gaussianCoeffs
    gaussianCoeffs = coefList[length]
    gaussianWindow = len(gaussianCoeffs)
    # gaussianWindow = 9
    # gaussianCoeffs = [0.000592904, 0.0097501, 0.0720441, 0.239195, 0.356837, 0.239195, 0.0720441, 0.0097501, 0.000592904]
    while iterations > 0:
        iterations -= 1
        output = np.zeros(array1d.size)
        for i in range(0, array1d.size):
            for j in range(0,gaussianWindow):
                if not((i+j-(gaussianWindow-1)/2) < 0 or (i+j-(gaussianWindow-1)/2 > array1d.size-1)):
                    output[i] += gaussianCoeffs[j] * array1d[int(i+j-(gaussianWindow-1)/2)]
        array1d = output
    return output

rms2 = gaussianFilter(rms,9,iterations=10)


# Normalize
rms = rms / np.max(rms)
rms2 = rms2 / np.max(rms2)

timevals = np.linspace(0, samplerate*len(rms)*512, len(rms))
timevals.size
fig = plt.figure()
ax = plt.axes()
ax.set_ylim([0,np.max(rms)])
ax.set_ylim([0,1])
ax.plot(timevals,rms, timevals, rms2)
plt.show()

fig = plt.figure()
ax = plt.axes()
ax.set_ylim([0,np.max(amplitudeSnips)])
# ax.set_ylim([0,10])
ax.plot(timeSamples,amplitudeSnips)
plt.show()

%matplotlib inline
import matplotlib.pyplot as plt
fig = plt.figure()
ax = plt.axes()
ax.set_xscale('log',basex=10)
ax.plot(xfftComp, 2.0/blocksize * yfftComp[500][:]) #Plot Left
plt.show()
