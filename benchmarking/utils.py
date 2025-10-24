import numpy as np
import re
import base64
import os
import json
# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def check_response(response, task):
    if task in ["caption", "color", "word"]:
        assert type(response) == str, '''Response Type Error: The response should be a string, but receiving {}. (Input response: {})'''.format(type(response), response)
    elif task == "object":
        assert type(response) == str, \
                         '''Response Type Error: The response should be a string, but receiving {}. (Input response: {})'''.format(type(response), response)
                                               
        # assert len(response.split(",")) == 3, '''Response Content Error: The response for object detection should be containing three objects, but receiving {}.'''.format(response)

    elif task == "fv":
        assert type(response) == list and np.all([len(_)==2 for _ in response]), '''Response Type Error: The response should be a list of coordinates, but receiving {}. (Input response: {})'''.format(type(response), response)
        for x,y in response:
            if (type(x) == int or type(x) == float) and (type(y) == int or type(y) == float):
                continue

            if type(x) == str:

                assert x.isnumeric(), '''Response Content Error: The response should contain numeric coordinates where x ∈ [0, 1280) and y ∈ [0, 1024), but receiving {} in response {}.'''.format(x, response)
            if type(y) == str:

                assert y.isnumeric(), '''Response Content Error: The response should contain numeric coordinates where x ∈ [0, 1280) and y ∈ [0, 1024), but receiving {} in response {}.'''.format(y, response)
 

def check_input_file(responses_to_evaluate, task, exisiting_response_dictionary):
    assert type(responses_to_evaluate) == dict, '''Input File Type Error: The input file should be a dictionary, following the structure of {"stimulus_ID_1": Response_1}, but receiving {}'''.format(type(responses_to_evaluate))
    for stimulus, response in responses_to_evaluate.items():
        assert stimulus in exisiting_response_dictionary.keys(), '''Stimulus Error: Stimulus {} does not exist in the test set, please double check your input file.'''.format(stimulus)
        check_response(response, task)

def construct_confmat(model_to_evaluate):
    labels = ["h_{}".format(model_to_evaluate)]
    confmatrices = {**{'h_machine':np.zeros((2,2))}, **{label: np.zeros((1,2)) for label in labels}}
    return confmatrices

def findanswerFV(text):
    results = []
#     print(re.search(templates[0],text))
    template = r'(?:.{0,5}Justification)'

    print(re.search(template,text))
    if re.search(template,text) is not None:
        summary_text = text[0:re.search(template,text).start()]
    else:
        summary_text = text
    summary_text = summary_text.split('\n')[0]
    print(summary_text)
    results = []
    for i, m in enumerate(re.finditer('(?:(AI-generated)|(Human))',summary_text)):
        print(m.group(0))
        if 'AI-generated' in m.group(0):
            results.append('M')
        elif 'Human' in m.group(0):
            results.append('H')
        else:
            return None
    print(results)
    if len(results) != 1 or len([_ for _ in results if _ in ['H','M']]) != 1:
        assert False
    return results

def findanswerGeneral(text, nTrials):
    results = []
    templates = [r'(?:.{0,6}Summary of Classifications)']
    flag = False
    for template in templates:
        if re.search(template,text) is not None:
            flag = True
            break
    if not flag:
        print(text)
        return        
    
    summary_text = text[re.search(template,text).start():]
    summary_text = summary_text.replace("Human or AI", "").replace("AI or Human","")
    results = []
    for i, m in enumerate(re.finditer('(?:(AI-generated)|(Human))',summary_text)):
        # print(m.group(0))
        if 'AI-generated'.lower() in m.group(0).lower():
            results.append('M')
        elif 'Human'.lower() in m.group(0).lower():
            results.append('H')
        else:
            return None
            # assert False, "Judge Error: Failed to find answers from current judgment text: {}".format(text)

    if i==1: # for grouping summary table 
        summary = summary_text.split('AI-generated:')
        if len(summary)!=2:
            return None
        results = [0] * nTrials
        for pos in re.finditer('\d',summary[0]):
            results[int(pos.group(0))-1] = 'H'
        for pos in re.finditer('\d',summary[1]):
            results[int(pos.group(0))-1] = 'M'        
        # assert False,  "Judge Error: Failed to find answers from current judgment text: {}".format(text)
    if len(results) != nTrials or len([_ for _ in results if _ in ['M','H']]) != nTrials:
        return None
        # assert False,  "Judge Error: Failed to find answers from current judgment text: {}".format(text)
    return results

def findanswer(text, nTrials):
    if nTrials == 1:
        return findanswerFV(text)
    else:
        return findanswerGeneral(text, nTrials)

def evaluate(stimuli_rootexisiting_response_dictionary,task,responses_to_evaluate,prompt_format,opt,client,max_tokens):
    judge_results = {}

    for stimulus, trials in exisiting_response_dictionary.items():
        # stimulus_path = if it's image based
        if task == "word":
            cue = stimulus 
            responses = [trial['response'] for trial in trials] + [responses_to_evaluate[stimulus]]
            responses_str = ' '.join(['{}. {}'.format(i+1, response) for i,response in enumerate(responses)])
            prompt = prompt_format.format(cue, responses_str)
        elif task == "fv":
            stimulus_path = os.path.join(stimuli_root,stimulus)
            base64_image = encode_image(stimulus_path)     
            scanpath = responses_to_evaluate[stimulus]
            prompt = prompt_format.format(scanpath)
        else:
            stimulus_path = os.path.join(stimuli_root,stimulus)
            base64_image = encode_image(stimulus_path)
            responses = [trial['response'] for trial in trials] + [responses_to_evaluate[stimulus]]
            responses_str = ' '.join(['{}. {}'.format(i+1, response) for i,response in enumerate(responses)])
            prompt = prompt_format.format(responses_str) # caption -> list
        trial = 0
        ans = ""
        while ((task != "fv" and "Summary of Classification".lower() not in ans.lower()) or \
            (task == "fv" and "Justification".lower() not in ans.lower())) and trial < opt.num_trial:
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
                            ] if task != "word" else [
                                {"type": "text", "text": prompt}],
                        }
                    ],
                    max_tokens=max_tokens,
                )
            ans = response.choices[0].message.content
            trial += 1
        print(ans)
        if  ((task != "fv" and "Summary of Classification".lower() in ans.lower()) or \
            (task == "fv" and "Justification".lower() in ans.lower())):        
            judge_results[stimulus] = ans
        else:
            print("Skipping Warning: Fail to judge {}".format(stimulus))
    if opt.save:
        if not os.path.exists("judge_results"):
            os.makedirs("judge_results")
        with open('judge_results/{}_zeroshot_judge_results.json'.format(task), 'w') as f:
            json.dump(judge_results,f)
    return judge_results

def compile_results(judge_results, nTrials):
    results_d = {}

    for k,text in judge_results.items():

        if k not in results_d:
            results = findanswer(text,nTrials)
            if results is not None:
                results_d[k] = results 
            else:
                print("Skipping Warning: Cannot find judgement for {}, due to messy response structure from AI judge".format(k))
    return results_d

def get_confmat(opt,exisiting_response_dictionary,results_d, task):
    ai_judge = {}
    trial_count = 1
    label_dict = {'human':0,'machine':1}
    
    confmat_overall = construct_confmat(opt.name)
    for k, gt_d in exisiting_response_dictionary.items():
        if k not in results_d:
            print("Skipping Warning: Cannot find judgement for {}, due to messy response structure from AI judge".format(k))
            continue
        trialdata = {'response_speaker':{'H':'human','M':'machine'}[results_d[k][-1]], 
                    'groundtruth':"machine", 
                    'machine_groundtruth': opt.name}
        ai_judge['Trial_{}'.format(trial_count)] = {'trialData':trialdata}
        trial_count += 1
        confmat_overall['h_machine'][label_dict[trialdata['groundtruth']]][label_dict[trialdata['response_speaker']]] += 1
        if task == "fv":
            continue
        for i, gt in enumerate(gt_d):
            trialdata = {'response_speaker':{'H':'human','M':'machine'}[results_d[k][i]],
                        'groundtruth':gt['groundtruth'],
                        'machine_groundtruth':gt['machine_groundtruth']}
        
            if trialdata['groundtruth'] == 'human':
                ai_judge['Trial_{}'.format(trial_count)] = {'trialData':trialdata}
                trial_count += 1
                confmat_overall['h_machine'][label_dict[trialdata['groundtruth']]][label_dict[trialdata['response_speaker']]] += 1
    return confmat_overall