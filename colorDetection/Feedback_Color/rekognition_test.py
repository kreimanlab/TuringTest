import boto3
from tqdm import tqdm
import os
import pickle

image_folder = 'turing_test_2/static/dataset/coco_val_set/'
local_image_paths = sorted([os.path.join(image_folder,i) for i in os.listdir(image_folder) if i.endswith('jpg')])


impath_to_tags = {}
for local_image_path in tqdm(local_image_paths):
    impath_to_tags[local_image_path] = []

    client=boto3.client('rekognition')
    with open(local_image_path, 'rb') as image:
        response = client.detect_labels(Image={'Bytes': image.read()})
    
    for label in response['Labels']:
        impath_to_tags[local_image_path].append([label['Name'],label['Confidence']])


with open('rekognition_detected_tags.p','wb') as F:
    pickle.dump(impath_to_tags, F)
