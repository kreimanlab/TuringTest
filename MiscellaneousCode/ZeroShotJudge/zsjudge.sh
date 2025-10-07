export OPENAI_API_KEY="${OPENAI_API_KEY}"

# nohup python chatgpt_caption_zsjudge.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_image_captioning_zeroshotjudge.log 2>&1 &
# nohup python chatgpt_color_zsjudge.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_color_est_zeroshotjudge.log 2>&1 &
# nohup python chatgpt_obj_zsjudge.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_obj_det_zeroshotjudge.log 2>&1 &
# nohup python chatgpt_wordassoc_zsjudge.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_wordassoc_zeroshotjudge.log 2>&1 &
nohup python chatgpt_fv_zsjudge.py > /home/liuxiao/TuringGithub/XiaoData/xiao_logs/chatgpt_fv_zeroshotjudge.log 2>&1 &