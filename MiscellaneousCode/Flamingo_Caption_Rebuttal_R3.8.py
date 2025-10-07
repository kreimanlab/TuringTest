from huggingface_hub import hf_hub_download
import torch

from open_flamingo import create_model_and_transforms
import os
from PIL import Image
import requests
import torch
import pickle
import json 

model, image_processor, tokenizer = create_model_and_transforms(
    clip_vision_encoder_path="ViT-L-14",
    clip_vision_encoder_pretrained="openai",
    lang_encoder_path="togethercomputer/RedPajama-INCITE-Instruct-3B-v1",
    tokenizer_path="togethercomputer/RedPajama-INCITE-Instruct-3B-v1",
    cross_attn_every_n_layers=2
)


checkpoint_path = hf_hub_download("openflamingo/OpenFlamingo-4B-vitl-rpj3b-langinstruct", "checkpoint.pt")
model.load_state_dict(torch.load(checkpoint_path), strict=False)
model.to(1)

img_root = "/home/liuxiao/Downloads/COCO2017/val2017"
answers = {}
# captioning_prompt = '''Question: Describe all the important parts of the scene with a complete sentence. Answer:'''#'''Question: Describe the scene. Answer:'''
captioning_prompt = '''Question: What are things in this picture? Describe the scene with one complete sentence. Answer:'''

tokenizer.padding_side = "left"
with open('/home/liuxiao/TuringGithub/XiaoData/cocoval2017-subset-for-rebuttal-r3.8.json','r') as f:
    captions_val2017_anno_d = json.load(f)

for imageid, entry in captions_val2017_anno_d.items():
    # img_path = os.path.join(img_root, '000{}.jpg'.format(fn))
    image_path = os.path.join(img_root,entry['file_name'])
    query_image = Image.open(image_path)
    vision_x = image_processor(query_image).unsqueeze(0)
    vision_x = vision_x.unsqueeze(1).unsqueeze(0).to(1)
    lang_x = tokenizer(
    ["<image>{}".format(captioning_prompt)],
    return_tensors="pt",
    ).to(1)
    
    generated_text = model.generate(
        vision_x=vision_x,
        lang_x=lang_x["input_ids"],
        attention_mask=lang_x["attention_mask"],
        max_new_tokens=50,
        num_beams=3,
        pad_token_id=tokenizer.eos_token_id
    ).cpu()    # cleaned_response = [re.sub(r'[^a-zA-Z]', '', _).lower() for _ in answer_text.split(',')]
    # answers.setdefault(fn,[]).extend(cleaned_response)
    answer = tokenizer.decode(generated_text[0]).split('Answer:')[-1].replace('<|endofchunk|>','')
    answers[imageid] = answer #.replace("This is a photo of")
    print(imageid,answer)
    # if i == 10:
    # break
with open("/home/liuxiao/TuringGithub/XiaoData/all_results/flamingo-4B-vitl-rpj3b-langinstruct_caption_cocoval201717_r3.8.pkl", 'wb') as f:
    pickle.dump(answers, f)
with open("/home/liuxiao/TuringGithub/XiaoData/all_results/flamingo-4B-vitl-rpj3b-langinstruct_caption_cocoval201717_r3.8.pkl", 'rb') as f:
    print(pickle.load(f))
