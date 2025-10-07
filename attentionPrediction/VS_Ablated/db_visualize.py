import csv
import sqlite3

# conn=sqlite3.connect('participants.db')
conn=sqlite3.connect('participants.db')
cursor=conn.cursor()
cursor.execute("select * from newdb;")
with open("out_livetrial.csv",'w') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow([i[0] for i in cursor.description])
    csv_writer.writerows(cursor)
conn.close()