# Can Machines Imitate Humans? Integrative Turing Tests for Vision and Language Demonstrate a Narrowing Gap

Authors: Mengmi Zhang, Elisa Pavarino, Xiao Liu, Giorgia Dellaferrera, Ankur Sikarwar, Caishun Chen, Marcelo Armendariz, Noga Mudrik, Prachi Agrawal, Spandan Madan, Mranmay Shetty, Andrei Barbu, Haochen Yang, Tanishq Kumar, Shui'Er Han, Aman Raj Singh, Meghna Sadwani, Stella Dellaferrera, Michele Pizzochero, Brandon Tang, Yew Soon Ong, Hanspeter Pfister, and Gabriel Kreiman

This repository contains an implementation of the Turing tests in six vision and language tasks. Our paper is currently under review.

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

Go to each of these folders and unzip ```MturkExps.zip```. Each of these AMT folders has two experiments: one is to collect responses from human agents for Turing dataset curation; the other is to collect responses from human judges in the actual Turing tests. 

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
## Instructions for the post-rebuttal repository
Access to our code, data, results, and plots after the rebuttal [HERE](https://drive.google.com/drive/folders/17xp1r3KeQVjCZ5yw4wa8epoVN6gLsVVg?usp=sharing)

Follow the readme inside.

For a quick glance, we provide the example source files within the ```imageCaptioning\Plot```. You may refer to the readme file inside the ```imageCaptioning\Plot\readme.md``` for more details.

## License

See [Kreiman lab](http://klab.tch.harvard.edu/code/license_agreement.pdf) for license agreements before downloading and using our source codes and datasets.
In each task, it contains a zip file with all the Amazon Mechanical Turk (AMT) studies. 

