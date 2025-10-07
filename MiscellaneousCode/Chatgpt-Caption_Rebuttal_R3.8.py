from openai import OpenAI
import os
import pickle
import base64
import json
import random
import json
client = OpenAI()

img_root = "/home/liuxiao/Downloads/COCO2017/val2017"



# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

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
with open('/home/liuxiao/TuringGithub/XiaoData/cocoval2017-subset-for-rebuttal-r3.8.json','r') as f:
    captions_val2017_anno_d = json.load(f)
answers = {}
for imageid, entry in captions_val2017_anno_d.items():
    # Path to your image
    # fn = "0235.jpg"
    image_path = os.path.join(img_root,entry['file_name'])
    # Getting the Base64 string
    base64_image = encode_image(image_path)
    sampled_length = random.sample(human_lengths,1)[0]
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
    response_len = 0
    trial = 0
    while (response_len > sampled_length or response_len < 6) and trial < 5:
        response = client.chat.completions.create(
            model="chatgpt-4o-latest",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": captioning_prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            max_tokens=100,
        )
        ans = response.choices[0].message.content
        response_len = len(ans.split(' '))
        print("[{}]".format(trial), imageid, sampled_length,response_len, response.choices[0])
        answers[imageid] = ans
        trial += 1
    # break
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_image_captioning_v3_cocoval2017_rebuttal_r3.8.pkl', 'wb') as f:
    pickle.dump(answers,f)
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_image_captioning_v3_cocoval2017_rebuttal_r3.8.pkl', 'rb') as f:
    print(pickle.load(f))