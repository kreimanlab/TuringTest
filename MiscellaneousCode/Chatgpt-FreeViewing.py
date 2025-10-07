from openai import OpenAI
import os
import pickle
import base64
import requests
from PIL import Image, PngImagePlugin, JpegImagePlugin
client = OpenAI()

img_root = "/home/liuxiao/TuringGithub/imagecaption/MturkExps/image_captioning_task/Data/imgset"
def load_image(image_file):
    if isinstance(image_file, str) and (image_file.startswith('http://') or image_file.startswith('https://')):
        response = requests.get(image_file)
        image = Image.open(BytesIO(response.content)).convert('RGB')
    elif isinstance(image_file, (JpegImagePlugin.JpegImageFile, PngImagePlugin.PngImageFile)):
        image = image_file.convert('RGB')
    else:
        image = Image.open(image_file).convert('RGB')
    return image

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


# Getting the Base64 string

# image_paths = ["/home/liuxiao/AttentionPredictionDatasets/datasets/naturaldesign/stimuli/img{}.jpg".format(_) for _ in ["157","103"]]
img_root = "/home/liuxiao/AttentionPredictionDatasets/datasets/naturaldesign/stimuli"
answers = {}
print('NUMBER OF IMAGES:',len(os.listdir(img_root)))
for fn in os.listdir(img_root):
    # Path to your image
    # fn = "0235.jpg"
    image_path = os.path.join(img_root,fn)
    base64_image = encode_image(image_path)
    # Get Width, Height
    W,H = load_image(image_path).size
    prompt = '''Identify objects and regions that would attract a human's gaze during a natural viewing of the scene. Predict the sequence with 15 fixations a typical observer might make, explaining why each fixation occurs. The output should be formatted as a structured fixation sequence, where each fixation includes the following attributes:\n\
Coordinates(integer x indicating width ranging from 0 to {}, integer y indicating height ranging from 0 to {}): Approximate fixation position in the image.\n\
Fixation Duration(string): The estimated time spent fixating on this object.\n\
Justification(string): A short explanation of why this object or region attracted attention.\n'''.format(W,H)
    response = client.chat.completions.create(
        model="chatgpt-4o-latest",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ],
        max_tokens=1024,
    )
    print('======='*5)
    print(prompt,'\n',response)
    print(response.choices[0].message.content)
    answers[fn] = response.choices[0].message.content
    # break
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_free_viewing.pkl', 'wb') as f:
    pickle.dump(answers,f)
with open('/home/liuxiao/TuringGithub/XiaoData/all_results/chatgpt_free_viewing.pkl', 'rb') as f:
    print(pickle.load(f))