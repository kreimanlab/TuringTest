# -*- coding: utf-8 -*-
"""
Created on Tue Nov  1 09:29:01 2022

@author: noga mudrik

age (3 bins: <35 yo; 35-45; >45)
gender (2 bins: F, M)
education (3 bins: below bachelor, bachelor, above bachelor)
Please plot confmat + barplot for individual bin here. Post them on slack or send the slides to me by latest tmr Friday AND include these figures on overleaf. (You have to write your own part if there are delays in delivering these plots to me). (e 
                                                                                                                                                                                                                                                       
"""
import json 
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from colour import Color
startColor = Color('#6495ED') #light blue
EndColor = Color("#00008B") #dark blue


dict_labels = {'age':{'26-30':'Age<35', '21-25':'Age<35','31-35':'Age<35', '45-50':'Age(>45)', 
                      '41-45':'Age(35-45)','36-40':'Age(35-45)'},
               'gender':{'male'  : 'Gender(M)', 'female' : 'Gender(F)'},
               'education': {'high school': 'Middle/High' , 'master': 'PostGrad', 'bachelor':'Bachelor'
                             }             
               }    
    
# Opening JSON file
f = open('noga_human_judge.json')
  
# returns JSON object as 
# a dictionary
data = json.load(f)

"""
Create df of demographics
"""
columns = ['country', 'age', 'engagement', 'difficulty', 'mode', 'gender',
       'education', 'condition', 'native']
columns_selc = ['country', 'age' ,   'education', 'gender', 'native']
#, 'engagement', 'difficulty', 'mode',

df_demographic = pd.DataFrame(columns= columns)
for trial_id in data.keys():
    df_cur = pd.DataFrame(data[trial_id]['workerData'], index = [0])
    df_demographic = pd.concat([df_demographic, df_cur], axis = 0)
    #df_demographic['age'].value_counts().plot.pie(autopct='%1.1f%%')
df_demographic = df_demographic[columns_selc]    
#fig, axs = plt.subplots(2, int(len(columns_selc)/2), figsize = (6,20))  
#axs = axs.flatten()  
for col_i, col in enumerate(columns_selc):
    base = df_demographic[col]
    if col in dict_labels.keys():
        for key,val in dict_labels[col].items():
            base = base.str.replace(key,val)
    plt.figure()
    
    count_data = base.value_counts()
    count_data = count_data/count_data.sum()
    labels_actual = []
    
    colors = list(startColor.range_to(EndColor,count_data.shape[0])) 
    colorlist = []
    for item in colors:
        colorlist.append(item.hex)
    count_data.index = [list(count_data.index)[i] + "[" + str("{:.1f}".format(item*100)) + "%]" for i, item in enumerate(count_data) ]
    # for i, item in enumerate(count_data):
    #     labels_actual.append( labels[i]+ "[" + str("{:.1f}".format(item*100)) + "%]" )
    #autopct='%1.1f%%', ax = ax,                                                #labels = labels_actual,
    count_data.plot.pie( colors = colorlist, startangle = 0)