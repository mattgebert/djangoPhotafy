import os
import soundfile as sf
import numpy as np
import librosa
import gzip
import itertools
import json, codecs


# READ SEGMENTS OF DATA
def CQT(filePath, octaves=12, bins_per_octave=120, min_freq_hz = 5, binTimeSecs = 0.03):
    # Process FFT Data
    y, samplerate = sf.read(filePath)

    # Need to select bins such that we have enough octaves to span from low freq (5hz) to 44100 Hz (Minimum 8 octaves?)
    octaves = 12
    bins_per_octave = 120 #bins per octave
    nb = bins_per_octave*octaves #number of bins
    min_freq_hz = 5 #frequency minimum

    # Sampling Data
    binTime = 0.03
    desiredHopLength = samplerate * binTime
    hopLength = int(desiredHopLength - desiredHopLength%2**9) #Round to be a proper proportion of the file
    binTime = hopLength / samplerate

    # number of samples is: duration * samplerate / hop_length
    300*samplerate/hopLength

    # Analyse Left and right channels
    yfftL = np.abs(librosa.cqt(y[:,0], hop_length = hopLength, min_freq_hz=min_freq_hz, sr=samplerate, n_bins=nb, bins_per_octave=bins_per_octave))
    yfftR = np.abs(librosa.cqt(y[:,1], hop_length = hopLength, min_freq_hz=min_freq_hz, sr=samplerate, n_bins=nb, bins_per_octave=bins_per_octave))
    # Average the left and right channels, take the magnitude of the complex values.
    yfft = (yfftL + yfftR)/2;

    # Force the smallest set of samples at the end to squish into a 3D matrix by padding.
    if (yfft[-1].shape != yfft[-2].shape):
        zeros = np.zeros(yfft[-2].shape)
        zeros[:yfft[-1].shape[0]] = yfft[-1]
        yfft[-1] = zeros
    yfft = np.stack(yfft, axis=0)
    # Rotate data:
    yfft=yfft.T

    # Get corresponding cqt bins
    xfft = librosa.cqt_frequencies(n_bins=nb, bins_per_octave=bins_per_octave, min_freq_hz=min_freq_hz)

    # Truncate to be a multiple of 10 elements
    truncateFactor = 10;
    yfftsm = yfft[::,0:yfft.shape[1]-yfft.shape[1]%truncateFactor]
    yfftsm.shape

    # Calculate sums
    coefCompFactor=1;
    yfftComp = np.sum(yfftsm.reshape(yfftsm.shape[0],-1,coefCompFactor), axis=2)

    # Cast xfft array to the same size too
    xfftsm = xfft[0:xfft.shape[0] - xfft.shape[0]%truncateFactor]
    xfftComp = xfftsm[::coefCompFactor]

    # Calculate max array values:
    max = yfftComp.max()

    # Normalize coefficients:
    yfftComp = yfftComp / max;
    yfftComp = np.power(yfftComp,0.3)
    max=1 #Amplitude of output
    yfftComp = np.around(yfftComp,decimals=2)
    xfftComp = np.around(xfftComp,decimals=2)

    # Generate timestamps
    timestamps = np.array([binTime * i for i in range(0,yfftComp.shape[0])])

    # Write json file: make a dict in python.
    dataOutput = [{'t':i,'spectra':j.tolist()} for i,j in zip(timestamps,yfftComp)]
    analysisOutputPath = dir_path + '/static/photaMusic/data_new.json'

    output = {'xaxis':xfftComp.tolist(), "blockTime":binTime,"max":max,"data":dataOutput}
    return output

def CQT_Dict(filePath):
    output = CQT(filepath)
    json.dump(output, codecs.open(analysisOutputPath, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4)

def CQT_Gzip(filePath):
    output = CQT(filepath)
    json_str = json.dumps(output, separators=(',', ':'), sort_keys=True, indent=4)
    json_bytes = json_str.encode('utf-8')
    analysisOutputPath2 = dir_path + '/static/photaMusic/data_new.gzip'
    with gzip.GzipFile(analysisOutputPath2, 'w') as fout:
        fout.write(json_bytes)
