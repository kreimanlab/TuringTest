from openai import OpenAI
import os
import pickle
import base64
import json
import random
import json
client = OpenAI()

# img_root = "/home/liuxiao/TuringGithub/imagecaption/MturkExps/image_captioning_task/Data/imgset"
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/cuewords.pkl', 'rb') as f:
    word_dict = pickle.load(f)

wordassoc_prompt = "Name a word that you associate with [{}]. Please provide your answer with only one word."
answers = {}
for fn, word in word_dict.items():

    
    response = client.chat.completions.create(
            model="chatgpt-4o-latest",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": wordassoc_prompt.format(word)}
                    ],
                }
            ],
            max_tokens=10,
        )
    ans = response.choices[0].message.content
    print("[{}]".format(word), ans)
    answers[fn] = [word,ans]

    # break
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_word_assoc.pkl', 'wb') as f:
    pickle.dump(answers,f)
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_word_assoc.pkl', 'rb') as f:
    print(pickle.load(f))