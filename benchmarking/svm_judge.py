import numpy as np
from sklearn import datasets
from sklearn.model_selection import KFold, cross_val_score
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix
import pickle, json
import openai

def floatScanpath2Int(scanpath,W=1280,H=1024):
    converted_scanpath = []
    scanpath = [_ for _ in scanpath if _ != [1,1]]
    for (x,y) in scanpath:
        x,y = int((x+1)*W/2), int((y+1)*H/2)
        converted_scanpath.append([x,y])
    return converted_scanpath

def intScanpath2Float(scanpath,W=1280,H=1024):
    converted_scanpath = []
    for (x,y) in scanpath:
        x,y = float(x*2/W-1), float(y*2/H-1)
        converted_scanpath.append([x,y])
    return converted_scanpath

def get_embedding(text, engine="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return openai.Embedding.create(input=[text], engine=engine)["data"][0]["embedding"]

def run_SVM_judge(exisiting_response_dictionary, responses_to_evaluate,task,api_key=None):
    # load data
    if task == "color":
        all_data = load_color_estimation_data(exisiting_response_dictionary, responses_to_evaluate)
    elif task == "object":
        all_data = load_object_detection_data(exisiting_response_dictionary, responses_to_evaluate,api_key)
    elif task == "fv":
        all_data = load_free_viewing_data(exisiting_response_dictionary, responses_to_evaluate)
    elif task == "word":
        all_data = load_word_association_data(exisiting_response_dictionary, responses_to_evaluate,api_key)
    elif task == "caption":
        all_data = load_captioning_data(exisiting_response_dictionary, responses_to_evaluate,api_key)
        
    # run svm
    if task == "color":
        return n_fold_SVM_judge(all_data)
    elif task == "fv":
        return n_copy_SVM_judge(all_data,divisor=[[2, 2], [5, 5]])
    elif task in ["caption","object","word"]:
        return n_copy_SVM_judge(all_data,divisor=[[1, 1], [1, 1]])


def n_copy_SVM_judge(all_data_copies,divisor):
    # for N_human >> N_machine
    accuracies = []
    sum_conf_matrix = np.zeros((2, 2), dtype=float)
    

    for sample_time, all_data in enumerate(all_data_copies):
        print("==="*10)
        print("Testing on chunk {}".format(sample_time))
        X, y, sources = [], [], []
        N = len(all_data["human"])
        model_names = [k for k in all_data.keys() if k!="human"]
        # Human data
        X.extend(all_data["human"])
        y.extend([0] * N)
        sources.extend(["human"] * N)     

        # Machine data
        for model_name in model_names:
            M = len(all_data[model_name])
            sources.extend([model_name] * M)
            y.extend([1] * M)
            X.extend(all_data[model_name])

        print("Constructed 10-fold testing within this chunk")
        kf = KFold(n_splits=10, shuffle=True, random_state=42)
        X = np.array(X)
        y = np.array(y)
        sources = np.array(sources)
        fold_conf_mats = []
        fold_accs = []
        for i, (train_index, test_index) in enumerate(kf.split(X)):
            print("Testing on fold {} of chunk {}".format(i, sample_time))
            svm_model = SVC()
            X_train, X_test = X[train_index], X[test_index]
            y_train, y_test = y[train_index], y[test_index]
            
            svm_model.fit(X_train, y_train)
            y_pred = svm_model.predict(X_test)
            test_sources = sources[test_index]
            mask = np.isin(test_sources, ["human", "model_to_evaluate"])
            y_test_filtered = y_test[mask]
            y_pred_filtered = y_pred[mask]
            acc = accuracy_score(y_test_filtered, y_pred_filtered)
            cm = confusion_matrix(y_test_filtered, y_pred_filtered, labels=[0, 1])
            fold_accs.append(acc)
            sum_conf_matrix += cm 
        
        accuracies.append(np.mean(fold_accs))
    sum_conf_matrix /= np.array(divisor)

    return accuracies, np.mean(accuracies), np.std(accuracies), sum_conf_matrix


def n_fold_SVM_judge(all_data):
    
    N = len(all_data["human"])
    M = len(all_data.keys()) - 1
    model_names = [k for k in all_data.keys() if k!="human"]
    chunk_size = N // M

    accuracies = []
    sum_conf_matrix = np.zeros((2, 2), dtype=float)

    for sample_time in range(M):
        print("==="*10)
        print("Testing on chunk {}".format(sample_time))
        X, y, sources = [], [], []

        # Human data
        X.extend(all_data["human"])
        y.extend([0] * N)
        sources.extend(["human"] * N)       
        
        # Machine data
        for model_name in model_names:
            start = sample_time * chunk_size
            end = N if sample_time == M - 1 else (sample_time + 1) * chunk_size
            sources.extend([model_name] * (end - start))
            y.extend([1] * (end - start))
            X.extend(all_data[model_name][start:end])
        
        print("Constructed 10-fold testing within this chunk")
        kf = KFold(n_splits=10, shuffle=True, random_state=42)
        X = np.array(X)
        y = np.array(y)
        sources = np.array(sources)
        fold_conf_mats = []
        fold_accs = []
        for i, (train_index, test_index) in enumerate(kf.split(X)):
            print("Testing on fold {} of chunk {}".format(i, sample_time))
            svm_model = SVC()
            X_train, X_test = X[train_index], X[test_index]
            y_train, y_test = y[train_index], y[test_index]
            
            svm_model.fit(X_train, y_train)
            y_pred = svm_model.predict(X_test)
            test_sources = sources[test_index]
            mask = np.isin(test_sources, ["human", "model_to_evaluate"])
            y_test_filtered = y_test[mask]
            y_pred_filtered = y_pred[mask]
            acc = accuracy_score(y_test_filtered, y_pred_filtered)
            cm = confusion_matrix(y_test_filtered, y_pred_filtered, labels=[0, 1])
            fold_accs.append(acc)
            sum_conf_matrix += cm 
        
        accuracies.append(np.mean(fold_accs))
    sum_conf_matrix /= np.array([[M, M], [1, 1]])

    return accuracies, np.mean(accuracies), np.std(accuracies), sum_conf_matrix

def load_color_estimation_data(exisiting_response_dictionary, responses_to_evaluate):
    with open('data/color/color_to_bert.p','rb') as F:
        color_to_embedding = pickle.load(F)
        color_to_embedding['none'] = color_to_embedding['white']
    image_embeddings = {}

    all_data = {}
    for img_id, responses in exisiting_response_dictionary.items():
        if img_id not in image_embeddings.keys():
            with open("data/color/image_embeddings/"+img_id.replace(".jpg",".p"),"rb") as F:
                image_embedding = pickle.load(F)
                image_embeddings[img_id] = image_embedding
        else:
            image_embedding = image_embeddings[img_id]
        
        for response in responses: 
            response["response"] = "none" if response["response"] not in color_to_embedding.keys() else response["response"]
            color_embedding = color_to_embedding[response["response"]].detach().numpy()
            concatenated_features = np.hstack((image_embedding.detach().numpy(), color_embedding[0]))
            gt = "human" if response["machine_groundtruth"] == "" else response["machine_groundtruth"]
            all_data.setdefault(gt,[]).append(concatenated_features)
        
        try: # Transform response to embedding
            color_embedding = color_to_embedding[responses_to_evaluate[img_id]]
        except:
            print("Response Content Warning: {} not in the dictionary".format(response["response"]))
            color_embedding = color_to_embedding['none']
        concatenated_features = np.hstack((image_embedding.detach().numpy(), color_embedding[0]))
        all_data.setdefault("model_to_evaluate",[]).append(concatenated_features)

    return all_data
        
def load_object_detection_data(exisiting_response_dictionary, responses_to_evaluate,api_key):
    all_data = {}
    embedding_copy = {}
    openai.api_key = api_key
    for img, responses in exisiting_response_dictionary.items():
        for response in responses:
            if response["groundtruth"] == "human":
                human_emb = get_embedding(response["response"])
                all_data.setdefault("human",[]).append(np.array(human_emb))
                
                break
        machine_emb = get_embedding(responses_to_evaluate[img])
        all_data.setdefault("model_to_evaluate",[]).append(np.array(machine_emb))
        embedding_copy[img] = {"human":human_emb,"machine":machine_emb}
    with open("object_embeddings.pkl","wb") as f:
        pickle.dump(embedding_copy, f)
    return [all_data]


def load_free_viewing_data(exisiting_response_dictionary, responses_to_evaluate):
    all_data_copies = []
    sample_time = 5
    count_conditions = [list(range(i*2, i*2+4)) for i in range(4)] + [[0,1,9,10]]
    for i in range(sample_time):
        all_data = {}
        for img_id, responses in exisiting_response_dictionary.items():
            human_count = 0
            for response in responses: 
                scanpath = response["response_float"]
                scanpath = np.array(scanpath).flatten()
                gt = "human" if response["machine_groundtruth"] == "" else response["machine_groundtruth"]
                if gt != "human" or (gt == "human" and human_count in count_conditions[i]): 
                    all_data.setdefault(gt,[]).append(scanpath)
                human_count += 1 if gt == "human" else 0
            if type(responses_to_evaluate[img_id][0][0]) == int:
                scanpath = intScanpath2Float(responses_to_evaluate[img_id])
            scanpath = scanpath + [[1,1]]*15
            scanpath = scanpath[:15]
            scanpath = np.array(scanpath).flatten()
            all_data.setdefault("model_to_evaluate",[]).append(scanpath)
        all_data_copies.append(all_data)
    return all_data_copies 

def load_captioning_data(exisiting_response_dictionary, responses_to_evaluate, api_key):
    all_data = {}
    embedding_copy = {}
    openai.api_key = api_key
    for img, responses in exisiting_response_dictionary.items():
        for response in responses:
            if response["groundtruth"] == "human":
                human_emb = get_embedding(response["response"])
                all_data.setdefault("human",[]).append(np.array(human_emb))
                
                break
        machine_emb = get_embedding(responses_to_evaluate[img])
        all_data.setdefault("model_to_evaluate",[]).append(np.array(machine_emb))
        embedding_copy[img] = {"human":human_emb,"machine":machine_emb}
    with open("caption_embeddings.pkl","wb") as f:
        pickle.dump(embedding_copy, f)
    return [all_data]

def load_word_association_data(exisiting_response_dictionary, responses_to_evaluate, api_key):
    all_data = {}
    embedding_copy = {}
    openai.api_key = api_key
    for cueword, responses in exisiting_response_dictionary.items():
        cueword_emb = get_embedding(cueword)
        cueword_emb = np.array(human_emb)
        for response in responses:
            if response["groundtruth"] == "human":
                human_emb = get_embedding(response["response"])
                human_emb = np.array(human_emb)
                all_data.setdefault("human",[]).append((human_emb-cueword_emb)**2)
                
                break
        machine_emb = get_embedding(responses_to_evaluate[cueword])
        machine_emb = np.array(machine_emb)
        all_data.setdefault("model_to_evaluate",[]).append((machine_emb-cueword_emb)**2)
        embedding_copy[img] = {"human":human_emb,"machine":machine_emb,"cue":cueword_emb}
    with open("word_embeddings.pkl","wb") as f:
        pickle.dump(embedding_copy, f)
    return [all_data]

# def load_word_association_data(exisiting_response_dictionary, responses_to_evaluate):
#     sample_time = 5
#     to_replace_key = ["gpt3promptdav","word2vec","gpt3emb","gpt2","gpt3promptcurie"]
#     all_data_copies = []
#     with open("data/word/glove-twitter-25.json","r") as f:
#         glove_dict = json.load(f)

#     for i in range(sample_time):
#         all_data = {}
#         for cueword, responses in exisiting_response_dictionary.items():
#             cueword_emb = np.array(glove_dict[cueword])
#             for response in responses:
#                 if response["machine_groundtruth"] == to_replace_key[i]:
#                     continue
#                 gt = "human" if response["machine_groundtruth"] == "" else response["machine_groundtruth"]
#                 try:
#                     response_emb = np.array(glove_dict[response["response"]])
#                 except:
#                     print("Response Content Warning: {} not in the glove dictionary, replacing it with '#'".format(response["response"]))
#                     response_emb = np.array(glove_dict["#"])

#                 all_data.setdefault(gt,[]).append((response_emb-cueword_emb)**2)
#             try:
#                 response_emb =  np.array(glove_dict[responses_to_evaluate[cueword]])
#             except:
#                 print("Response Content Warning: {} not in the glove dictionary, replacing it with '#'".format(response["response"]))
#                 response_emb = np.array(glove_dict["#"])               

#             all_data.setdefault("model_to_evaluate",[]).append((response_emb-cueword_emb)**2)
#         all_data_copies.append(all_data)
#     return all_data_copies