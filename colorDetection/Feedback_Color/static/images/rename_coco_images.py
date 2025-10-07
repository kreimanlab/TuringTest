import os
import shutil

img_folder = 'val2017'
new_folder = 'coco_val_set'
os.makedirs(new_folder, exist_ok = True)

im_names = sorted(os.listdir(img_folder))
for i in range(len(im_names)):
	print(i)
	im_name = im_names[i]
	im_path = os.path.join(img_folder, im_name)
	new_im_path = os.path.join(new_folder, "%s.jpg"%(i+1))
	shutil.copyfile(im_path, new_im_path)