import os
import numpy as np
import json, codecs
import itertools
from scipy.fftpack import fft
# CONVERT TO WAVE FOORMAT
# hydrogen:interrupt-kernel

# filename = "Phota - The Fifth Part.mp3"
# filename = "Ellie Goulding - Lights (Phota Remix).mp3"
# filename = "Shepard Tone.mp3"
filename = "1khz.mp3"
# dir_path = os.path.dirname(os.path.realpath(__file__))
dir_path = os.getcwd()
inputFilepath = dir_path + "/static/photaMusic/mp3/" + filename
outputFilepath = dir_path + "/static/photaMusic/output.wav"
inputFilepath = inputFilepath.replace(" ","\ ").replace("(","\(").replace(")","\)")
outputFilepath = outputFilepath.replace(" ","\ ")
# Remove old file:
command = "rm " + outputFilepath
os.system(command)
# write new file
command = "ffmpeg -i " +  inputFilepath + " " + outputFilepath
os.system(command)

# READ SEGMENTS OF DATA
import soundfile as sf
import matplotlib.pyplot as plt

# Process FFT Data
data, samplerate = sf.read(outputFilepath)
blockTime = 5 #seconds
blocksize = int(np.floor(blockTime*samplerate)) #Matches 0.25s worth of playing
blocksize

y = [block for block in sf.blocks(outputFilepath, blocksize=blocksize, overlap=0, always_2d=True)]
# yfft = [np.fft.fft(block) for block in y]
# yfft = np.stack(yfft[0:len(yfft)-1])[:,:,0]
# yfft = np.abs(yfft)
yfft = np.abs(np.fft.rfft(y[3][:,0]))
yfft.shape

xfft = np.linspace(0.0, samplerate/2, int(blocksize/2+1))
xfft.shape

# plt.axes(xscale='log')
plt.plot(xfft, 2.0/blocksize * np.abs(yfft[0:blocksize]))

yf = np.abs(fft(y[3][:,0]))
blocksizeontwo = int(blocksize/2)
xf = np.linspace(0.0, samplerate/2, blocksizeontwo)
plt.plot(xf, 2.0/blocksize * yf[0:blocksizeontwo])
