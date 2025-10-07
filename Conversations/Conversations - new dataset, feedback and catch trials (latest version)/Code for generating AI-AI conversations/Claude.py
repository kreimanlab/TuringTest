import anthropic
import os
import time
import numpy as np
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import re


# Load API key
load_dotenv()
load_dotenv("variables.env")

# Retrieve the API key
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")


client = anthropic.Anthropic(api_key=anthropic_api_key)
#anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")

# Set up Anthropic Client
#client = anthropic.Anthropic(api_key=anthropic_api_key)

# Path to the folder containing HTML files
html_folder = "/Users/elisapavarino/Documents/Work_Directory/Kreiman_Lab/Turing Test Paper/TuringGithub/conversation/conversation_task/conversation_dataset"

# Function to extract word counts from <p> tags
def extract_word_counts_from_html(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
        conversation_turns = soup.find_all("p")
        word_counts = [len(turn.get_text().split()) for turn in conversation_turns]
        return word_counts

# Aggregate word counts from specific HTML files
all_word_counts = []
for i in range(1, 41):
    html_file = os.path.join(html_folder, f"conv{i}.html")
    if os.path.exists(html_file):
        all_word_counts.extend(extract_word_counts_from_html(html_file))

# Function to generate AI-like response lengths
def generate_response_length():
    return max(np.random.choice(all_word_counts), 7)

# Function to truncate text at a natural stopping point
def truncate_text(text, max_words):
    print(f"DEBUG BEFORE TRUNCATE: '{text}'") 
    words = text.split()
    if len(words) <= max_words:
        print(f"DEBUG AFTER TRUNCATE (No change): '{text}'")
        return text
    truncated_text = " ".join(words[:max_words])
    print(f"DEBUG AFTER TRUNCATE (Final): '{truncated_text}'") 
    return re.sub(r'[^.!?]*$', '', truncated_text).strip()

# Model and parameters
model = "claude-3-5-sonnet-20241022" #model #"claude-3-opus-20240229"  # Adjust model based on your access
temperature = 0.6
temperature_regen = 1

#list_names1 = ['John', 'Alice', 'Mark', 'Andrew', 'Julia', 'Georgia', 'Juliet', 'Lily', 'Olivia', 'Emmett', 'Miles', 'Oscar', 'William']
#list_names2 = ['Frank', 'Tom', 'Elizabeth', 'Gabriel', 'Paul', 'Alfie', 'Christina', 'Edward', 'Ella', 'Oliver', 'Karen', 'Isabel', 'Brad']
list_topics = ['fashion', 'politics', 'books', 'sports', 'general entertainment', 'music', 'science', 'technology', 'movies', 'food']

for conv in range(25, 26):
    time.sleep(1)
    filename = f'conv{conv}.html'
    with open(filename, "w") as file_html:
        #friend1 = np.random.choice(list_names1)
        #friend2 = np.random.choice(list_names2)
        topic = np.random.choice(list_topics)

        personality1 = np.random.choice(["logical and skeptical", "excitable and passionate", "sarcastic and witty", "serious and intellectual"])
        personality2 = np.random.choice(["curious and open-minded", "pragmatic and reserved", "opinionated and strong-willed", "friendly and cheerful"])

        # Anthropic handles system prompts separately
        system_prompt = f"A is {personality2} and is having a natural conversation with a friend. Avoid excessive agreement and looping. Keep answers under 20 tokens. If a topic has been discussed for too long, transition to a new subject smoothly. Be spare with punctuation. You can insert one spelling mistake. Keep answers short, text-like, and very informal. DO NOT always end with questions. No skipped turns."  #Instead of repeating excitement, introduce new questions or challenge each other’s views. 

        user_prompt = f"B is {personality1} and is having a natural conversation with a friend. They discuss {topic}, but they don’t always agree. Each person has their own perspective, and they challenge each other at times. They avoid excessive agreement and mutual praise. Be spare with punctuation. You can insert one spelling mistake. They ensure to change topics when the discussion slows down. Keep answers short, text-like, and very informal. **Do not ask a question at the end of your response. Conclude with a statement, reflection, or suggestion.**\n" + "A: Hi!\n:"

        for i in range(12):
            num_words = 0
            cnt = 0
            while num_words < 5 and cnt < 6:
                response_length = generate_response_length()
                #print(f"Debug: response_length = {response_length}")

                
                temperature_step = temperature + ((temperature_regen - temperature) / 5) * cnt

                response = client.messages.create(
                    model=model,
                    max_tokens=80,
                    system=system_prompt,  # System message goes here in Anthropic API
                    messages=[{"role": "user", "content": user_prompt}],
                    temperature=temperature_step,
                    top_p=1.0,
                    stop_sequences= [] #[f"{friend1}:", f"{friend2}:"]  # Equivalent to stop in OpenAI
                )
                
                if response.content:
                    string = " ".join([block.text for block in response.content]).strip()
                    
                    #  **Keep regenerating if response is empty**
                    while len(string.split()) < 2:  # Accepts anything longer than 1 word
                        response = client.messages.create(
                            model=model,
                            max_tokens=80,
                            system=system_prompt,
                            messages=[{"role": "user", "content": user_prompt}],
                            temperature=temperature_step,
                            top_p=1.0,
                            stop_sequences=[]
                        )
                        string = " ".join([block.text for block in response.content]).strip()
                    
                else:
                    string = "..."  #  Fallback if somehow we still get no response


                string = truncate_text(string, response_length)
                string = casual_text_formatting(string)
                num_words = len(string.split())
                cnt += 1
            
            speaker = f"\n{friend1}:"
            new_line = f"<p> A: {string} </p>\n"
            file_html.write(new_line)
            user_prompt += string + speaker

            num_words = 0
            cnt = 0
            
            while num_words < 5 and cnt < 6:
                response_length = generate_response_length()
                #print(f"Debug: response_length = {response_length}")

                
                temperature_step = temperature + ((temperature_regen - temperature) / 5) * cnt

                response = client.messages.create(
                    model=model,
                    max_tokens=80, #min(60, int(response_length * 1.3)),
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_prompt}],
                    temperature=temperature_step,
                    top_p=1.0,
                    stop_sequences= [] #[f"{friend1}:", f"{friend2}:"]
                )

                if response.content:
                    string = " ".join([block.text for block in response.content]).strip()
                    
                    # **Keep regenerating if response is empty**
                    while len(string.split()) < 2:  # Accepts anything longer than 1 word
                        response = client.messages.create(
                            model=model,
                            max_tokens= 80, #min(60, int(response_length * 1.3)),
                            system=system_prompt,
                            messages=[{"role": "user", "content": user_prompt}],
                            temperature=temperature_step,
                            top_p=1.0,
                            stop_sequences=[]
                        )
                        string = " ".join([block.text for block in response.content]).strip()
                    
                else:
                    string = "..."  # Fallback if somehow we still get no response


                string = truncate_text(string, response_length)
                string = casual_text_formatting(string)
                num_words = len(string.split())
                cnt += 1
            
            speaker = f"\n{friend2}:"
            new_line = f"<p> B: {string} </p>\n"
            file_html.write(new_line)
            user_prompt += string + speaker
        
        print(user_prompt)
