file = '/usr/share/dict/words'

with open(file,'r') as F:
	contents = F.readlines()


meta_str = 'const cars = ['

for c in contents:
	meta_str += '"%s",'%c.rstrip()

meta_str_2 = meta_str[:-1]
meta_str_2 += '];'

with open('all_words_js_array.txt','w') as F:
	print(meta_str_2, file=F)