from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

from array import array
import os
from PIL import Image
import sys
import time
import pickle
from tqdm import tqdm
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--task', help='enter tags, colors or captions', required=True)
parser.add_argument('--save_name', required=True)
parser.add_argument('--image_folder', required=True)
args = parser.parse_args()

print('\n\nPredicting %s from images...\n\n'%args.task)
subscription_key = "36900e5c7ba5454c9e596d5f634f1e04"
endpoint = "https://turingkreiman.cognitiveservices.azure.com/"

computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

image_folder = args.image_folder
print('Loading images from...\n %s'%args.image_folder)
local_image_paths = sorted([os.path.join(image_folder,i) for i in os.listdir(image_folder) if i.endswith('jpg')])

impath_to_info = {}
for local_image_path in tqdm(local_image_paths):
    local_image = open(local_image_path, "rb")

    if args.task == 'tags':
        impath_to_info[local_image_path] = []
        result_local = computervision_client.tag_image_in_stream(local_image)
        detected_tags = result_local.tags
        for tag in detected_tags:
            impath_to_info[local_image_path].append([tag.name,tag.confidence])
    elif args.task == 'colors':
        result_local = computervision_client.analyze_image_in_stream(local_image,visual_features=['color'])
        detected_dominant_colors = result_local.color.dominant_colors
        impath_to_info[local_image_path] = detected_dominant_colors
    elif args.task == 'captions':
        result_local = computervision_client.describe_image_in_stream(local_image)
        detected_captions = result_local.captions[0].text
        impath_to_info[local_image_path] = detected_captions
    
with open(args.save_name,'wb') as F:
    pickle.dump(impath_to_info, F)
