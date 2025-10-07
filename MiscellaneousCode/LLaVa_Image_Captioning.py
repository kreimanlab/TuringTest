from llava_model import Llava
IMAGE_TOKEN_INDEX = -200

import requests
from PIL import Image, PngImagePlugin, JpegImagePlugin
from io import BytesIO
# import datasets 
# from datasets import load_dataset
import re
import os
from collections import Counter
import pickle
import random
import json

import os

os.environ["CUDA_VISIBLE_DEVICES"]="0,1,2"

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

img_root = "/home/liuxiao/TuringGithub/imagecaption/MturkExps/image_captioning_task/Data/imgset"
answers = {}

path = "/home/liuxiao/TuringGithub/imagecaption/MturkExps/image_captioning_task/Turing_Test/static/data/main_caption_data.json"
with open(path) as f:
    d = json.load(f)
human_lengths = []

for v in d.values():
    # human 
    for t, pid in v['human']:
        l = len(t.split(' '))
        # human_lengths[l] = human_lengths.get(l,0)+1
        human_lengths.append(l)
print("Total images: ", len(os.listdir(img_root)))
for i, fn in enumerate(os.listdir(img_root)):
    sampled_length = max(random.sample(human_lengths,1)[0],10)
    captioning_prompt = '''Describe all the important parts of the scene with a complete sentence or a cohesive fragment.
    The description should contain at most {} words, at least 6 words.
    Avoid making spelling errors in the description.
    Do not describe unimportant details.
    Do not use any special characters like !, #, $, etc.
    Do not start the sentence with ‘‘There is’’ or ‘‘There are’’.
    Do not write your descriptions as ‘‘An image containing ...’’, ‘‘A photo of ...’’,  etc.
    Do not describe things that might have happened in the future or past.
    Do not use proper names for people.
    Do not describe what a person in the image might say.'''.format(sampled_length)
    img_path = os.path.join(img_root, fn)
    image = [load_image(img_path)]
    answer_text = " "
    trial = 0
    while (len(answer_text.split(' ')) > sampled_length or len(answer_text.split(' ')) < 6) and trial < 10:
        prompt, answer_text = llava.generate(captioning_prompt, image, 0.2)
        trial += 1
        print("[{}]".format(trial), fn, sampled_length, len(answer_text.split(" ")), answer_text)
    answers[fn] = answer_text
    # break
with open("/home/liuxiao/TuringGithub/XiaoData/all_results/llava-v1.6-mistral-7b_image_captioning_v2.pkl", 'wb') as f:
    pickle.dump(answers, f)
with open("/home/liuxiao/TuringGithub/XiaoData/all_results/llava-v1.6-mistral-7b_image_captioning_v2.pkl", 'rb') as f:
    print(pickle.load(f))
