# Can Machines Imitate Humans? Integrative Turing Tests for Vision and Language Demonstrate a Narrowing Gap

Authors: Mengmi Zhang, Elisa Pavarino, Xiao Liu, Giorgia Dellaferrera, Ankur Sikarwar, Caishun Chen, Marcelo Armendariz, Noga Mudrik, Prachi Agrawal, Spandan Madan, Mranmay Shetty, Andrei Barbu, Haochen Yang, Tanishq Kumar, Shui'Er Han, Aman Raj Singh, Meghna Sadwani, Stella Dellaferrera, Michele Pizzochero, Brandon Tang, Yew Soon Ong, Hanspeter Pfister, and Gabriel Kreiman

This repository contains an implementation of the Turing tests in six vision and language tasks. Our paper is currently under review.

Access to our unofficial manuscript [HERE](https://arxiv.org/abs/2211.13087)

Note that all the files are of large sizes. Download all the code, data, and results using the link below.

## Project Description

As AI algorithms increasingly participate in daily activities, it becomes critical to ascertain whether the agents we interact with are human or not. To address this question, we turn to the Turing test and systematically benchmark current AIs in their abilities to imitate humans in three language tasks (Image captioning, Word association, and Conversation) and three vision tasks (Object detection, Color estimation, and Attention prediction). The experiments involved 549 human agents plus 26 AI agents for dataset creation, and 1,126 human judges plus 10 AI judges, in 25,650 Turing-like tests. The results reveal that current AIs are not far from being able to impersonate humans in complex language and vision challenges. While human judges are often deceived, simple AI judges outperform human judges in distinguishing human answers from AI answers. The results of imitation tests are only minimally correlated with standard performance metrics in AI; thus, evaluating whether a machine can pass as a human constitutes an important independent test to evaluate AI algorithms. The curated, large-scale, Turing datasets introduced here and their evaluation metrics provide new benchmarks and insights to assess whether an agent is human or not and emphasize the relevance of rigorous, systematic, and quantitative imitation tests in other AI domains. 

## How To Use the Code

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

Always start by running ```Task1_PreCompileData.ipynb``` followed by ```Task1_Run1```, ```Task1_Run2```, ```Task1_Run3```, and so on. This is also applicable for other five tasks.

## Plot figures in the paper

For three language tasks, go to ```TuringGithub\conversation\Plot``` and run the following notebooks:
```
TaskAll_ConfmatOverall
TaskALL_LayoutFigures
```
For three vision tasks, go to ```TuringGithub\attention_prediction_task\Plot``` and run the following notebooks:
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

