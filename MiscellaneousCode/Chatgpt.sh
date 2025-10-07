export OPENAI_API_KEY="${OPENAI_API_KEY}"

# nohup python Chatgpt-Caption.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_image_captioning_v3.log 2>&1 &
# nohup python Chatgpt-FreeViewing.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_freeviewing_v2.log 2>&1 &
# nohup python Chatgpt-Caption_Rebuttal_R3.8.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_image_captioning_v3_rebuttal_r3.8.log 2>&1 &
# nohup python Chatgpt-ColorEst.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_color_estimation.log 2>&1 &
# nohup python Chatgpt-ObjectDet.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_object_detection.log 2>&1 &

nohup python Chatgpt-Association.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_word_association.log 2>&1 &
