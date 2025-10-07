# -*- coding: utf-8 -*-
"""
Created on Tue Nov  1 09:29:01 2022

@author: noga mudrik
"""
import json 
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
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
columns_selc = ['country', 'age', 'engagement', 'difficulty', 'mode', 'gender',
       'education',  'native']


df_demographic = pd.DataFrame(columns= columns)
for trial_id in data.keys():
    df_cur = pd.DataFrame(data[trial_id]['workerData'], index = [0])
    df_demographic = pd.concat([df_demographic, df_cur], axis = 0)
    #df_demographic['age'].value_counts().plot.pie(autopct='%1.1f%%')
df_demographic = df_demographic[columns_selc]    
fig, axs = plt.subplots(2, int(len(columns_selc)/2), figsize = (6,20))  
axs = axs.flatten()  
for col_i, col in enumerate(columns_selc):
    ax = axs[col_i]
    df_demographic[col].value_counts().plot.pie(autopct='%1.1f%%', ax = ax)