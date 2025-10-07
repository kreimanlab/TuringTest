from openai import OpenAI
import os
import pickle
import base64
import json
import random
import json
client = OpenAI()

img_root = "/home/liuxiao/TuringGithub/XiaoData/coco_val_set_color_det"



# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


color_estimation_prompt = "What is the dominant color in this picture? Select from the options: red, pink, orange, yellow, purple, green, blue, brown, gray, black, white. Provide your answer with only one word."

answers = {}
for fn in os.listdir(img_root):
    # Path to your image
    # fn = "0235.jpg"
    image_path = os.path.join(img_root,fn)
    # Getting the Base64 string
    base64_image = encode_image(image_path)

    response = client.chat.completions.create(
            model="chatgpt-4o-latest",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": color_estimation_prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            max_tokens=20,
        )
    ans = response.choices[0].message.content
    
    print("[{}]".format(fn), response.choices[0])
    answers[fn] = ans
    # break
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_color_estimation.pkl', 'wb') as f:
    pickle.dump(answers,f)
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_color_estimation.pkl', 'rb') as f:
    print(pickle.load(f))