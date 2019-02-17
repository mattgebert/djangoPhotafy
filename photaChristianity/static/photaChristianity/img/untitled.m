img = imread('crowd_streets.jpg');
I = rgb2gray(img);
imwrite(I,'crowd_streets_bw.jpg','jpg');