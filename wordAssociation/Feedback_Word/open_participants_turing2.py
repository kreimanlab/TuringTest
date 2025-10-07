# -*- coding: utf-8 -*-
"""
Created on Sat Oct 22 18:28:42 2022

@author: noga mudrik
"""
# loading in modules
import sqlite3
import pandas as pd
import json
import os
import numpy as np
save_path = r'C:\Users\noga mudrik\Documents\turing_associations\from_sep_30_files'
cue_words_list = np.load(save_path + os.sep +'all_cue_words_october_1.npy')
def find_real_from_response(response):
    response = response.split('.')[0]; response = response.split('/'); 
    model = response[-3]
    #if model == 'AI' :
    #try :
    #int(response[-2])
    model_num =  int(response[-2])
    #except:
    #else:
    #model_num = 0; model = response[-2]
    return model, model_num

dict_numbers_to_model_name = np.load('dict_numbers_to_model_name.npy',allow_pickle=True).item()
possible_models = dict_numbers_to_model_name.values()
possible_models_confusions = {model:  pd.DataFrame(columns =['human','AI'], 
                          index = ['human','AI'], data = np.zeros((2,2))) for model in possible_models}
dbfile = 'participants_28.db'
#dbfile = 'participants_copy.db'



cnx = sqlite3.connect(dbfile)
df = pd.read_sql_query("SELECT * FROM 'TuringAssociationAI_turing'", cnx)#TuringAssociationAI_turing








df_results = pd.DataFrame(columns =['human','AI'], 
                          index = ['human','AI'], data = np.zeros((2,2)))
vals = df['beginhit'].values
locs_vals = [i for i,v in enumerate(vals) if (v.startswith('2022-10-27') or v.startswith('2022-10-28'))]
df = df.iloc[locs_vals,:]
df = df.sort_values(by='beginhit')#['beginhit']
df = df.iloc[-80:,:]


res_per_subject = {i: json.loads(df['datastring'][i])  
                        for i in df['datastring'].index.values 
                        if (df['datastring'][i])} 

dict_cue_guess_humans = {}
dict_index_guess_humans = {}
cue_to_num_dict = {}
num_to_cue_dict = {}
model_real_dict = {'AI':0, 'human':0}
dict_ankur = {}
top1 = {}
counter = 0
for sub,res_per_subject_subject in res_per_subject.items():
    workerData = res_per_subject_subject['questiondata']
    workerID = res_per_subject_subject['workerId']
    for res_per_subject_subject_spec in res_per_subject_subject['data']:
        if 'trialdata' in res_per_subject_subject_spec:
            if 'prompt' in res_per_subject_subject_spec['trialdata']:
                counter += 1
                curres = res_per_subject_subject_spec['trialdata'];
                
                
                rt = curres['rt'] ###
                hit = curres['hit'] ###
                trial = curres['trial']
                
                
                    
                #'imageID', 'caption', 'counterbalance', 'groundtruth', 'phase', 'human_groundtruth'
                
                
                model_real, model_num = find_real_from_response(curres['prompt'])#response
                model_real_dict[model_real] = model_real_dict[model_real]+1
                guess = curres['guess_decision']; #print(guess); print(model_real)
                
                response_speaker = guess ###
                machine_groundtruth = dict_numbers_to_model_name[model_num]
                imageID = int(curres['prompt'].split('.')[0].split('/')[-1])
                caption = cue_words_list[imageID] # cue word
                counterbalance = 0
                groundtruth = model_real
                phase = curres['phase']
                human_groundtruth = ''
                trialData_save = {'rt':rt, 'hit':hit, 'trial':trial, 'response_speaker':guess,
                                  'machine_groundtruth':machine_groundtruth,'imageID':imageID,
                                  'caption': caption, 'counterbalance':counterbalance,'groundtruth':groundtruth,
                                  'phase':phase, 'human_groundtruth':human_groundtruth }
                dict_ankur['Trial_%d'%counter] = {'workerID':workerID , 'workerData':workerData,
                                           'trialData':trialData_save}
                
                
                
                df_results.loc[model_real,guess] = df_results.loc[model_real, guess]+1
                if model_real == 'AI':
                    possible_models_confusions[dict_numbers_to_model_name[model_num]].loc[model_real,guess] = possible_models_confusions[dict_numbers_to_model_name[model_num]].loc[model_real,guess] + 1
                else:
                    for model in possible_models_confusions.keys():
                        possible_models_confusions[model].loc[model_real,guess] = possible_models_confusions[model].loc[model_real,guess] + 1
                #top1[model].append([])
#top1 = {key:0.5*(val.iloc[0,0] + val.iloc[1,1])/val.sum(1).reshape((-1,1)) for key,val in possible_models_confusions.items()}
import seaborn as sns
import matplotlib.pyplot as plt
alpha = 1
fig, ax = plt.subplots(1,3)
sns.heatmap(df_results, alpha = alpha, ax  = ax[0], annot =True)
sns.heatmap(df_results/df_results.sum(axis = 1).values.reshape((-1,1)), alpha = alpha, ax = ax[1], vmin = 0, vmax = 1, annot = True)
sns.heatmap(df_results/df_results.sum(axis = 0),alpha = alpha, ax = ax[2], vmin = 0, vmax = 1, annot=True)
[ax_spec.set_xlabel('Guess', fontsize = 16) for ax_spec in ax]
[ax_spec.set_ylabel('real', fontsize = 16) for ax_spec in ax]
titles = ['Abs Counts', 'Normalized by Real', 'Normalized by Guess']
[ax_spec.set_title(titles[i], fontsize = 16) for i,ax_spec in enumerate(ax)]

#dict_numbers_to_model_name = np.load('dict_numbers_to_model_name.npy',allow_pickle=True).item()

titles = ['Abs Counts', 'Normalized by Real', 'Normalized by Guess']
fig, ax = plt.subplots(len(possible_models_confusions),3)
for model_count, model in enumerate(possible_models_confusions.keys()):
    df_results_c = possible_models_confusions[model]
    df_results_c.iloc[0,:] = df_results_c.iloc[0,:]/5
    sns.heatmap(df_results_c, alpha = alpha, ax  = ax[model_count, 0], annot =True)
    sns.heatmap(df_results_c/df_results_c.sum(axis = 1).values.reshape((-1,1)), alpha = alpha, ax = ax[model_count,1],
                vmin = 0, vmax = 1, annot = True,robust=True, cmap='RdBu_r')
    sns.heatmap(df_results_c/df_results_c.sum(axis = 0),alpha = alpha, ax = ax[model_count,2], vmin = 0, vmax = 1, annot=True
                ,robust=True, cmap='RdBu_r')
    [ax_spec.set_title(model + ': \n ' + titles[i], fontsize = 12) for i,ax_spec in enumerate(ax[model_count])]

#[[ax_spec.set_title(titles[i] + dict_, fontsize = 16) for i,ax_spec in enumerate(ax_i)] for ax_i_count,ax_i in enumerate(ax)]

#dict_numbers_to_model_name = np.load('dict_numbers_to_model_name.npy',allow_pickle=True).item()

[ax_spec.set_xlabel('Guess', fontsize = 11) for ax_spec in ax.flatten()]
[ax_spec.set_ylabel('real', fontsize = 11) for ax_spec in ax.flatten()]


"""
Make Ankur Dict
"""
json_path = r'C:\Users\noga mudrik\Downloads\ankur_human_judge.json'
with open('noga_human_judge.json', 'w') as json_file:
  json.dump(dict_ankur, json_file)
  
df_stacked = pd.DataFrame(index = ['Human','AI'] + list(possible_models_confusions.keys()), columns = ['human','AI'])
df_stacked.loc['Human',:] = possible_models_confusions['word2vec'].iloc[0].values
for key, val in possible_models_confusions.items():
    df_stacked.loc[key,:] =  val.iloc[1,:]
df_stacked.columns = ['Human', 'AI']
df_stacked.loc['AI',:] = df_stacked.iloc[2:,:].sum(0).values
df_stacked = df_stacked/df_stacked.sum(1).values.reshape((-1,1))
plt.figure();sns.heatmap(df_stacked.astype(float), annot=True,robust=True, cmap='RdBu_r', vmin=0, vmax=1)
plt.xlabel("Predicted")
plt.ylabel("Ground Truth")
plotname = 'confmat_humans'
#plt.savefig(plotname + '_confmat.png', bbox_inches='tight')

"""
top1
"""

"""
bar
"""
top1 = {key:0.5*(val.iloc[0,0]/val.sum(1).values[0] + val.iloc[1,1]/val.sum(1).values[1]) for key,val in possible_models_confusions.items()}

path_to_save = r'C:\Users\noga mudrik\Documents\turing_associations\turing_experiment\human_judge_files'
#np.save(path_to_save + os.sep + 'x_humans_human_judge.npy',x)
#words_humans = np.array([w.lower() for w in words_humans])
#np.save(path_to_save + os.sep + 'words_humans_%s.npy'%model_l,words_humans)
df_stacked.to_csv(path_to_save + os.sep + 'df_stack.csv')
top1['AI'] = np.mean(list(top1.values()))
df_top1 = pd.DataFrame(top1, index = ['Top-1 Accuracy']).T
df_top1.to_csv(path_to_save + os.sep +'df_top1.csv')

# name_csv = r'C:\Users\noga mudrik\Documents\turing_associations\from_sep_30_files\df_pairs_all_models.csv'
# csv_all_models_paris = pd.read_csv(name_csv)
# dict_numbers_to_model_name = {i:col for i,col in enumerate(csv_all_models_paris.columns[1:])}
# np.save('dict_numbers_to_model_name.npy',dict_numbers_to_model_name)


# def from_hit_to_cue(hit_string, cue_words_list, return_index = True):
#     hit_string_list = hit_string.split('_')
#     if return_index:
#         return int(hit_string_list[-1])
#     return cue_words_list[int(hit_string_list[-1])]

# save_path = r'C:\Users\noga mudrik\Documents\turing_associations\from_sep_30_files'
# cue_words_list = np.load(save_path + os.sep +'all_cue_words_october_1.npy')


# try:
#     processed_dict = np.load('human_response_pilot.npy', allow_pickle=True).item()
#     processed_dict_index = np.load('human_response_pilot_index.npy', allow_pickle=True).item()
#     rocessed_dict_shuffle = np.load('processed_dict_shuffle.npy', allow_pickle=True).item()
#     cue_to_num_dict = np.load('cue_to_num.npy', allow_pickle=True).item()
#     num_to_cue = np.load('num_to_cue.npy', allow_pickle=True).item()

# except:
#     # creating file path
#     dbfile = 'participants_turing.db'
    
    
    
#     cnx = sqlite3.connect(dbfile)
#     df = pd.read_sql_query("SELECT * FROM 'TuringAssociationAI'", cnx)
    
#     res_per_subject = {i: json.loads(df['datastring'][i])  
#                        for i in range(len(df['datastring'])) 
#                        if (df['datastring'][i])}
    
#     #and  isinstance(json.loads(df['datastring'][i]), dict 
#     dict_cue_guess_humans = {}
#     dict_index_guess_humans = {}
#     cue_to_num_dict = {}
#     num_to_cue_dict = {}
#     for sub,res_per_subject_subject in res_per_subject.items():
#         for res_per_subject_subject_spec in res_per_subject_subject['data']:
#             if 'trialdata' in res_per_subject_subject_spec:
#                 res_per_subject_subject_spec_trial = res_per_subject_subject_spec['trialdata']
#                 if 'guess_word ' in res_per_subject_subject_spec_trial:
#                     guess = res_per_subject_subject_spec_trial['guess_word ']
#                     cue = from_hit_to_cue(res_per_subject_subject_spec_trial['hit'], cue_words_list, return_index=False)
#                     index = from_hit_to_cue(res_per_subject_subject_spec_trial['hit'], cue_words_list, return_index=True)
#                     if cue not in dict_cue_guess_humans: dict_cue_guess_humans[cue] = []
#                     if index not in dict_index_guess_humans: dict_index_guess_humans[index] = []
#                     dict_cue_guess_humans[cue].append(guess)
#                     dict_index_guess_humans[index].append(guess)
#                     cue_to_num_dict[cue] = index
#                     num_to_cue_dict[index] = cue
                                    
#     def detect_similar(word1, word2, min_include = 0.7):
#         if min_include < 1:
#             min_include = int(min_include * np.min([len(word1), len(word2)]))    
#         if word1 in word2 or word2 in word1: # 
#             return True #word1 in word2 or word2 in word1 
#         elif min_include >= np.min([len(word1), len(word2)]):
#             return False
      
#         return detect_similar(word1[:-1], word2, min_include) or detect_similar(word1, word2[:-1], min_include ) or detect_similar(word1[1:], word2, min_include ) or detect_similar(word1, word2[1:], min_include)
    
    
#     def treat_vals(vals, cue):
#         print(cue)
#         vals =  [val.lower().strip().replace('_','') for val in vals if (len(val)>2 and not detect_similar(val, cue))] 
#         vals =  [val for val in vals if not(detect_similar(cue, val))]
#         return vals              
                    
#     processed_dict = {key:treat_vals(val,key) for key,val in dict_cue_guess_humans.items()}
#     processed_dict_index = {key:treat_vals(val,num_to_cue_dict[key]) for key,val in dict_index_guess_humans.items()}
#     processed_dict_shuffle = {key:val[np.random.randint(0,len(val))] for key, val in processed_dict.items()}
    
    
#     np.save('human_response_pilot.npy', processed_dict)
#     np.save('human_response_pilot_index.npy', processed_dict_index)
#     np.save('processed_dict_shuffle.npy', processed_dict_shuffle)
#     np.save('cue_to_num.npy', cue_to_num_dict)
#     np.save('num_to_cue.npy', num_to_cue_dict)

# # processed_dict = np.load('human_response_pilot.npy', allow_pickle=True).item()
# # processed_dict_index = np.load('human_response_pilot_index.npy', allow_pickle=True).item()
# # rocessed_dict_shuffle = np.load('processed_dict_shuffle.npy', allow_pickle=True).item()
# # cue_to_num_dict = np.load('cue_to_num.npy', allow_pickle=True).item()
# # num_to_cue = np.load('num_to_cue.npy', allow_pickle=True).item()

# """
# Save Human Response to files
# """

# # name_csv = 'df_pairs_all_models.csv'
# # csv_all_models_paris = pd.read_csv(name_csv)
# #words_humans = np.load('words_humans.npy')

# global path_save_humans
# path_save_humans = r'C:\Users\noga mudrik\Documents\turing_associations\turing_experiment\static\dataset\human'

# def write_html(name, number, path_save = path_save_humans):
#     # to open/create a new html file in the write mode
#     f = open(path_save_humans + os.sep + str(number) + '.html', 'w')
      
#     # the html code which will go in the file GFG.html
#     html_template = """<p>""" + name + """ </p>"""
      
#     # writing the code into the file
#     f.write(html_template)
      
#     # close the file
#     f.close()
    

    
# #cue_words = csv_all_models_paris['Cue Words'].values
# #words_humans = np.load('words_humans.npy')    
# dict_cue_human_ass = processed_dict_shuffle# {cue:words_humans[i] for i, cue in enumerate(cue_words)}
# [write_html('Cue: ' + cue + '; Association: ' + dict_cue_human_ass[cue], number) 
#  for cue, number in cue_to_num_dict.items()]    













"""
To find existing tables
"""
# con = sqlite3.connect(dbfile)
# cursor = con.cursor()
# cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
# print(cursor.fetchall())









# # Create a SQL connection to our SQLite database
# con = sqlite3.connect(dbfile)

# # creating cursor
# cur = con.cursor()

# # reading all table names
# table_list = [a for a in cur.execute("SELECT name FROM sqlite_master WHERE type = 'table'")]
# # here is you table list
# print(table_list)

# # Be sure to close the connection
# con.close()