export CUDA_VISIBLE_DEVICES=0,2,3

# nohup python LLaVa_Image_Captioning.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/llava_caption_v2.log 2>&1 &
nohup python LLaVa_Image_Captioning_Rebuttal_R3.8.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/llava_caption_v2_cocoval2017_r3.8.log 2>&1 &