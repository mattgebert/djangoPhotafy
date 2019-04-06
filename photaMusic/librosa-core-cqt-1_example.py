# Generate and plot a constant-Q power spectrum
import numpy as np
import librosa, librosa.display
import matplotlib.pyplot as plt
y, sr = librosa.load(librosa.util.example_audio_file())
C = np.abs(librosa.cqt(y, sr=sr))

y.shape
C.shape
C.T.shape
librosa.util.example_audio_file() #1min 1 sec.
2647*1/44100


librosa.display.specshow(librosa.amplitude_to_db(C, ref=np.max),
                         sr=sr, x_axis='time', y_axis='cqt_note')
plt.colorbar(format='%+2.0f dB')
plt.title('Constant-Q power spectrum')
plt.tight_layout()

# Limit the frequency range

C = np.abs(librosa.cqt(y, sr=sr, fmin=librosa.note_to_hz('C2'),
                n_bins=60))
C.shape

# array([[  8.827e-04,   9.293e-04, ...,   3.133e-07,   2.942e-07],
# [  1.076e-03,   1.068e-03, ...,   1.153e-06,   1.148e-06],
# ...,
# [  1.042e-07,   4.087e-07, ...,   1.612e-07,   1.928e-07],
# [  2.363e-07,   5.329e-07, ...,   1.294e-07,   1.611e-07]])

# Using a higher frequency resolution

C = np.abs(librosa.cqt(y, sr=sr, fmin=librosa.note_to_hz('C0'),
                n_bins=60 * 2, bins_per_octave=12 * 2))
C.shape
# array([[  1.536e-05,   5.848e-05, ...,   3.241e-07,   2.453e-07],
# [  1.856e-03,   1.854e-03, ...,   2.397e-08,   3.549e-08],
# ...,
# [  2.034e-07,   4.245e-07, ...,   6.213e-08,   1.463e-07],
# [  4.896e-08,   5.407e-07, ...,   9.176e-08,   1.051e-07]])

x = librosa.cqt_frequencies(n_bins=120, bins_per_octave=24, fmin=librosa.note_to_hz('C0'))
x.shape

D = C.T


plt.axes(xscale='log')
plt.plot(x,D[1,:])
