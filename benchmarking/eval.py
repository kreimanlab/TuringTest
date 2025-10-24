from openai import OpenAI
from utils import check_input_file, encode_image, construct_confmat, findanswer, evaluate, compile_results, get_confmat
from config import get_variables
import json
import argparse
import os
import pickle
import base64
import random


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--task", "-t", 
                        type=str,
                        choices=["word","caption","color","object","fv","all"],
                        help="Select a task you wish to evaluate your model on.")
    parser.add_argument("--responses_file_path","-rfp",
                        type=str,
                        help="The path to your json file containing responses from your model.")
    parser.add_argument("--num_trial","-nt",
                        type=int,
                        default=3,
                        help="The number of times that the zero-shot AI judge can try on each response for. \
                        This is to ensure cleaner responses from the zero-shot AI judge.")
    parser.add_argument("--name","-n",
                        type=str,
                        default="custom model",
                        help="The name of the model to be evaluated.")
    parser.add_argument("--mode","-m",
                        type=str,
                        default="zs",
                        choices=["zs"],
                        help="Select an evaluation mode: currently ony support zero-shot judge.")
    parser.add_argument("--save", 
                        action="store_true", 
                        default=False,
                        help="Save judge's responses")

    opt = parser.parse_args()


    ## pre-define stimulus paths, etc
    if opt.task == "all":
        tasks = ["word","caption","color","object","fv"]
        responses_file_paths = [os.path.join(opt.responses_file_path,"{}.json".format(task)) for task in tasks]
    else:
        tasks = [opt.task]
        responses_file_paths = [opt.responses_file_path]

    client = OpenAI()
    for task, responses_file_path in zip(tasks,responses_file_paths):
        print("Start Evaluating for task {}, with reponse file path {}".format(task,responses_file_path))
        prompt_format, exisiting_response_dictionary_path, max_tokens, stimuli_root, nTrials = get_variables(task)

        # load original response dictionary
        # structure of the dictionary should follow:
        # {"0001.jpg": [
        #    {"stimulus_ID": "0001.jpg", "response": "XXXX", "groundtruth": "machine","human_groundtruth":"",machine_groundtruth:"XXXX"}, # response 1
        #    {...}, # response 2    
        #    ...
        #    ], # stimulus 1
        #  "0002.jpg": [XXXX] # stimulus 1
        # } 
        if exisiting_response_dictionary_path is not None:
            with open(exisiting_response_dictionary_path) as f:
                exisiting_response_dictionary = json.load(f)

        ## Rread user's json file
        # structure of the dictionary should follow:
        # {"stimulus 1": response 1
        # ...
        # }
        print("Checking input file...")
        with open(responses_file_path) as f:
            responses_to_evaluate = json.load(f)        

        ## function to check users' responses
        check_input_file(responses_to_evaluate, task, exisiting_response_dictionary)

        ## Call zero-shot judge
        print("Evaluating...")
        judge_results = evaluate(stimuli_root,exisiting_response_dictionary,task,responses_to_evaluate,prompt_format,opt,client,max_tokens)

        # with open('judge_results/{}_zeroshot_judge_results.json'.format(opt.task), 'r') as f:
        #     judge_results = json.load(f)
        #     print(judge_results

        ### Compile Results
        results_d = compile_results(judge_results, nTrials)

        ### Get Confusion Matrix
        confmat_overall = get_confmat(opt,exisiting_response_dictionary,results_d,task)
        
        # Calculate results
        conf_mat = confmat_overall['h_machine']
        ph_h, pm_m = conf_mat.diagonal() / (conf_mat.sum(1)+1e-7)

        # We do not re-evaluate human trials for free-viewing since each trial is evaluated individually 
        # Unlike other four tasks where all trials for one stimulus are evaluated together,
        # we directly use p(H|H) for free viewing task from the paper
        ph_h = 0.87 if task == "fv" else ph_h
        detectability = (ph_h + pm_m) / 2
        print("==="*20)
        print("Result Report for task ",task)
        print("Detectability Score:", detectability)
        print("Confusion Matrix:", conf_mat)
        print("p(M|M):",pm_m)