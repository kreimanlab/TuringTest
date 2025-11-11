# Can Machines Imitate Humans? Integrative Turing Tests for Vision and Language Demonstrate a Narrowing Gap

Authors: Mengmi Zhang, Elisa Pavarino, Xiao Liu, Giorgia Dellaferrera, Ankur Sikarwar, Caishun Chen, Marcelo Armendariz, Noga Mudrik, Prachi Agrawal, Spandan Madan, Mranmay Shetty, Andrei Barbu, Haochen Yang, Tanishq Kumar, Shui'Er Han, Aman Raj Singh, Meghna Sadwani, Stella Dellaferrera, Michele Pizzochero, Brandon Tang, Yew Soon Ong, Hanspeter Pfister, and Gabriel Kreiman

This repository contains an implementation of the Turing-like tests in six vision and language tasks. Our paper is currently under review.

Access to our unofficial manuscript [HERE](https://arxiv.org/abs/2211.13087)

Note that all the files are of large sizes. Download all the code, data, and results using the link below.

## Project Description

As AI becomes increasingly embedded in daily life, ascertaining whether an agent is human is critical. We systematically benchmark AI’s ability to imitate humans in three language tasks (image captioning, word association, conversation) and three vision tasks (color estimation, object detection, attention prediction), collecting data from 636 humans and 37 AI agents. Next, we conducted 72,191 Turing-like tests with 1,916 human judges and 10 AI judges. Current AIs are approaching the ability to convincingly impersonate humans and deceive human judges in both language and vision. Even simple AI judges outperformed humans in distinguishing AI from human responses. Imitation ability showed minimal correlation with conventional AI performance metrics, suggesting that passing as human is an important independent evaluation criterion. The large-scale Turing datasets and metrics introduced here offer valuable benchmarks for assessing human-likeness in AI and highlight the importance of rigorous, quantitative imitation tests for AI development.

## How To Use the Code

The code is itemized in the individual tasks here on github. For space constraints, many of the datasets used for the tasks, and all the plots, are not loaded. For the complete set of results, with plots and data in addition to code, please refer to our google drive. 
For more directions on specifics of the code, please read the README_how_to_run_code.md

Access to our code, data, results, and plots [HERE](https://drive.google.com/file/d/1U2C1FqoCBpcp1VmYp1aTH0juMeP4u82A/view?usp=sharing)

Once the zip file (~6GB) is downloaded, unzip it.
The zip consists of six folders corresponding to all the six tasks:

-Task 1: ```imagecaption```

-Task 2: ```wordAssociation```

-Task 3: ```conversation```

-Task 4: ```dominant_color_recognition```

-Task 5: ```multi_label_prediction```

-Task 6: ```attention_prediction_task```

Go to each of these folders and unzip ```MturkExps.zip```. Each of these AMT folders has two experiments: one is to collect responses from human agents for Turing dataset curation; the other is to collect responses from human judges in the actual Turing-like tests. 

The instructions for setting up these AMT experiments are the same as instructed in ***Human Psychophysics Experiments on Amazon Mechanical Turk*** from this github respository [HERE](https://github.com/kreimanlab/Put-In-Context/blob/master/README.md).

## Software requirements
This project uses **Python** (for data analysis) and **JavaScript** (for human psychophysics experiments) and can run on most modern computers.
To collect new Turing responses, you will need an **MTurk** or **Prolific** account.

### Python Packages for Data Analysis

Install these packages to run the core analysis code:

* `numpy`
* `matplotlib`
* `colour`
* `seaborn`
* `pandas`
* `pingouin`
* `scipy`
* `statsmodels`
* `scikit-learn`

### Additional Packages for AI Agents and AI Judges

For the AI agent and AI judge code, please also install:

* `torch`
* `torchvision`
* `openai`
* `huggingface_hub`
* `open-flamingo`
* `tqdm`
* `Pillow`

### AI Agents

We used a variety of AI models across tasks (see Table S1 in the paper).
Please refer to each model’s official documentation for installation and usage in their official repositories:

* [GPT-4](https://openai.com/)
* [ChatGPT-4](https://openai.com/)
* [BLIP-Large](https://github.com/salesforce/BLIP)
* [OFA-Huge](https://github.com/OFA-Sys/OFA)
* [OpenFlamingo-4B](https://github.com/mlfoundations/open_flamingo)
* [Microsoft Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/)
* [Google Vision API](https://cloud.google.com/vision)
* [Amazon Rekognition](https://aws.amazon.com/rekognition/)
* [LLaVA](https://github.com/haotian-liu/LLaVA)
* [SCST model](https://github.com/ruotianluo/self-critical.pytorch)
* *(…and other models listed in Table S1)*

## Result analysis

First, set up your python environment using Anaconda:
```
conda create -n py39 python=3.9
```
Activate the conda environment:
```
conda activate py39
jupyter notebook
```
Refer to this github respository [HERE](https://github.com/kreimanlab/Put-In-Context/blob/master/README.md) for installation of Anaconda.

Within each task folder, go to ```Plot```, run all the jupyter notebook in sequence based on the naming conventions below.

For example, in Task 1 ```imagecaption```, the jupyter notebooks are organized in the following sequence: ```Task1_PreCompileData.ipynb``` and ```Task1_RunX_Y.ipynb``` format, where ```X``` is the run number and ```Y``` is the function description of the notebook. 

All the jupyter notebooks have to be run according to the following sequence, as the previous jupyter notebook might generate processed files and save those files before the next notebook takes them as inputs for further processing. 

Always start by running ```Task1_PreCompileData.ipynb``` followed by ```Task1_Run1```, ```Task1_Run2```, ```Task1_Run3```, and so on. This is also applicable for the other five tasks.

## Plot figures in the paper

For the three language tasks, go to ```TuringGithub\conversation\Plot``` and run the following notebooks:
```
TaskAll_ConfmatOverall
TaskALL_LayoutFigures
```
For the three vision tasks, go to ```TuringGithub\attention_prediction_task\Plot``` and run the following notebooks:
```
Task4_6_ConfmatOverall
Task4_6_LayoutFigures
```
## Benchmark Your Model

This repository provides an **AI judge benchmarking tool** to evaluate your model’s detectability across five tasks:

| Task | Number of Stimuli for AI Agents |
|------|-------------------|
| Word Association | 150 |
| Image Captioning | 1000 |
| Color Detection | 873 |
| Object Detection | 808 |
| Free Viewing | 240 |

Follow the steps below to run the benchmark.


###  Step 1: Generate Model Responses

Use the stimuli provided under  
```bash
/benchmarking/stimuli
```

Your model should generate one response per stimulus. Save the results as a Python dictionary and export it to JSON format. Please use the file names of provided stimuli as the dictionary keys. For example:

```python
{ 
  "1017.jpg": "green", 
  "672.jpg": "gray",
  ...
}
```
For the word association task, please use the provided cue words as the dictionary keys.


### Step 2: Organize Response Files

If you wish to automatically evaluate all five tasks, name your response files as follows and place them in a single folder under `/benchmarking/`:

| Task | File Name |Response Format| Response Example |
|------|------------|----------------|----------------|
| Word Association | `word.json` | `str`| `"neural"`|
| Image Captioning | `caption.json` |`str` | `"a plate of carrots and broccoli on a table"`
| Color Detection | `color.json` |`str` | `"brown"`
| Object Detection | `object.json` | a `str` containing top three objects, separated by `,`| `"forehead, nose, hair"`|
| Free Viewing | `fv.json` | a `list` of numeric coordinates| `[[644, 644], [694, 644], [644, 694]] `|



### Step 3: Set Up OpenAI API Access
 
You’ll need an **OpenAI API key** to run evaluations.  
Refer to [OpenAI’s API key guide](https://platform.openai.com/docs/quickstart/create-and-export-an-api-key) for setup instructions.

Set your API key in the terminal:

```bash
export OPENAI_API_KEY=YOUR_API_KEY
```

### Step 4: Run the Evaluation

Navigate to the `/benchmarking` directory and run:

**Evaluate a single task:**
```bash
python eval.py -t caption -rfp PATH_TO_RESPONSE_FILE -n YOUR_MODEL_NAME --api_key YOUR_API_KEY
```

**Evaluate all tasks:**
```bash
python eval.py -t all -rfp PATH_TO_RESPONSE_FOLDER -n YOUR_MODEL_NAME --api_key YOUR_API_KEY
```

**Optional arguments:**
- `--mode` / `-m`: You can either choose zero-shot judge (`-m zs`) or SVM judge (`-m svm`).
- `--num_trial` / `--nt`: Maximum number of attempts the AI judge will retry each response until a valid judgment is produced.  
- `--save`: Save the AI judge’s outputs to a file.

### Notes

- The repository uses **`text-embedding-3-small`** for the SVM judge in `Word Association`, `Image Captioning` and `Object Detection` tasks and  **`chatgpt-4o-latest`** as the zero-shot AI judge for all five tasks.  
  If the model is deprecated, please check [OpenAI’s model list and pricing](https://platform.openai.com/docs/pricing) for alternatives.  

- Ensure that file naming and folder structure follow the provided format.  
  Example response files can be found under `/responses`.

- The detectability score calcuated by our benchmarking function may be different from those reported in our paper, due to deprecations of specific models we used. If you wish to reproduce our results, please refer to our first section.

- We recommend running long evaluations using `nohup`, `screen`, or `tmux`, and redirecting output to a log file. For example:
  ```bash
  nohup python eval.py -t all -rfp PATH_TO_FOLDER -n YOUR_MODEL_NAME > out.log 2>&1 &
  ```


## Instructions for the post-rebuttal repository
Access to our code, data, results, and plots after the rebuttal [HERE](https://drive.google.com/drive/folders/17xp1r3KeQVjCZ5yw4wa8epoVN6gLsVVg?usp=sharing)

Follow the README_how_to_run_code.md

For a quick glance, we provide the example source files within the ```imageCaptioning\Plot```. You may refer to the readme file inside the ```imageCaptioning\Plot\readme.md``` for more details.

## License

See [Kreiman lab](http://klab.tch.harvard.edu/code/license_agreement.pdf) for license agreements before downloading and using our source codes and datasets.
In each task, it contains a zip file with all the Amazon Mechanical Turk (AMT) studies. 

