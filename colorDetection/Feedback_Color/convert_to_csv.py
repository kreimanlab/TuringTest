import csv
import sqlite3
import pandas as pd
import json

conn = sqlite3.connect('participants.db')
cursor = conn.cursor()
cursor.execute("select * from tablechairDB;")
with open("out.csv", 'w') as csv_file: 
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow([i[0] for i in cursor.description]) 
    csv_writer.writerows(cursor)
conn.close()

content = pd.read_csv('out.csv')
cont = pd.DataFrame.to_dict(content)
c = json.loads(cont['datastring'][0])

with open('out.json','w') as F:
    json.dump(c, F)
