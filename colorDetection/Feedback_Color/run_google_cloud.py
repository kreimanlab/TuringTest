import numpy
from PIL import Image
import os
from google.cloud import vision
import io
import pickle
from tqdm import tqdm
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--task', help='enter tags, colors or captions', required=True)
parser.add_argument('--save_name', required=True)
parser.add_argument('--image_folder', required=True)
args = parser.parse_args()

image_folder = args.image_folder
print('Loading images from...\n %s'%args.image_folder)
local_image_paths = sorted([os.path.join(image_folder,i) for i in os.listdir(image_folder) if i.endswith('jpg')])[:1200]


def detect_labels_and_properties(path):
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations
    labels_parsed = []
    for label in labels:
        labels_parsed.append(label.description)
    
    colors_parsed = []
    response_2 = client.image_properties(image=image)
    props = response_2.image_properties_annotation
    for color in props.dominant_colors.colors:
        colors_parsed.append(color)
    
    image_info = [labels_parsed, colors_parsed]

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

    return image_info

for impath in tqdm(im_paths):
    detections = detect_labels_and_properties(impath)
    new_path = impath.replace(folder, out_folder).replace('.jpg','.p')
    with open(new_path, 'wb') as F:
        pickle.dump(detections, F)
