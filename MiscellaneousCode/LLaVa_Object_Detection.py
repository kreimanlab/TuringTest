from llava_model import Llava
IMAGE_TOKEN_INDEX = -200

import requests
from PIL import Image, PngImagePlugin, JpegImagePlugin
from io import BytesIO
import datasets 
from datasets import load_dataset
import re
import os
from collections import Counter
import pickle

def load_image(image_file):
    if isinstance(image_file, str) and (image_file.startswith('http://') or image_file.startswith('https://')):
        response = requests.get(image_file)
        image = Image.open(BytesIO(response.content)).convert('RGB')
    elif isinstance(image_file, (JpegImagePlugin.JpegImageFile, PngImagePlugin.PngImageFile)):
        image = image_file.convert('RGB')
    else:
        image = Image.open(image_file).convert('RGB')
    return image

model_path = "liuhaotian/llava-v1.6-mistral-7b"
llava = Llava(model_path, None)

img_root = "/home/liuxiao/TuringGithub/dominant_color_recognition/dominant_color_recognition/static/dataset/coco_val_set"
object_detection_prompt = "What objects do you see in this image? Please provide 3 different one-word responses."
answers = {}
for _ in range(5):
    for i, fn in enumerate(os.listdir(img_root)):
        img_path = os.path.join(img_root, fn)
        image = load_image(img_path)
        prompt, answer_text = llava.generate(object_detection_prompt, image, 0.2)
        cleaned_response = [re.sub(r'[^a-zA-Z]', '', _).lower() for _ in answer_text.split(',')]
        answers.setdefault(fn,[]).extend(cleaned_response)

for k,v in answers.items():
    answers[k] = [_[0] for _ in Counter(v).most_common(3)]

with open("llava_results/llava-v1.6-mistral-7b_object_detection.pkl", 'wb') as f:
    pickle.dump(answers, f)

