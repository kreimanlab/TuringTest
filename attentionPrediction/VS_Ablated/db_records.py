import csv
import json
# csv file name
filename = "trialdata.csv"

# initializing the titles and rows list
fields = []
rows = []
'''
List of subjects:
"Subject(uniqueid|A2PVR5AFEIOGJK:3EO896NRAXGR4W1OXQZLHHJF88STJS, condition|0, status|4, codeversion|1.0)",
    "Subject(uniqueid|A18C0TJO4VTS15:30BUDKLTXEGH8E46ITBSH9N6TA9E5M, condition|0, status|4, codeversion|1.0)",
    "Subject(uniqueid|A1WCNRUU7H9UIF:374TNBHA8CG4754V2MBPMNAD7I1QYQ, condition|0, status|4, codeversion|1.0)",
    "Subject(uniqueid|AL1GOCVKQNC9G:3X65QVEQI18GD5NDEPL48AJ0UOWLCO, condition|0, status|4, codeversion|1.0)",
    "Subject(uniqueid|A1J2ZU4AH7V6N6:33LKR6A5KF5K9FLK71YBD5AQK4RT19, condition|0, status|4, codeversion|1.0)",
    "Subject(uniqueid|AP4FJ47D2L0D8:3FE2ERCCZYT7DFZEWMN2KRM1OCQPOX, condition|0, status|4, codeversion|1.0)"

'''
subject_list = ["A2PVR5AFEIOGJK:3EO896NRAXGR4W1OXQZLHHJF88STJS","A18C0TJO4VTS15:30BUDKLTXEGH8E46ITBSH9N6TA9E5M", "A1WCNRUU7H9UIF:374TNBHA8CG4754V2MBPMNAD7I1QYQ", "AL1GOCVKQNC9G:3X65QVEQI18GD5NDEPL48AJ0UOWLC", "A1J2ZU4AH7V6N6:33LKR6A5KF5K9FLK71YBD5AQK4RT19"
, "AP4FJ47D2L0D8:3FE2ERCCZYT7DFZEWMN2KRM1OCQPOX"]
# reading csv file
with open(filename, 'r') as csvfile:
	# creating a csv reader object
	csvreader = csv.reader(csvfile)
	
	# extracting field names through first row
	# fields = next(csvreader)

	# extracting each data row one by one
	for row in csvreader:
		rows.append(row)

	# get total number of rows
	print("Total no. of rows: %d"%(csvreader.line_num))
fields = ['Subject', 'Machine or Human?', 'What object?', 'Age', 'Gender', 'Field', 'Degree']
records = {}
# printing first 5 rows
num=0
for row in rows:
    for subj_name in subject_list:  
        if (subj_name in row[0]):
            result_dict = json.loads(row[3])
            if("rt" in result_dict):
                if(subj_name in records):
                    

          
	# 	print(col+" "),
	# print('\n')
print(num)