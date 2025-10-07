# Multitask Cognitive Benchmark Repository

This repository contains code, data, and experiment pipelines for a multitask benchmark suite targeting six distinct cognitive tasks, along with supplementary data and code for auxiliary or exploratory experiments.

## 📁 Repository Structure

### 🎯 Core Tasks

Each of the following six tasks has its own top-level folder:

1. **`imageCaptioning`** – Task 1: Image Captioning
2. **`wordAssociation`** – Task 2: Word Association
3. **`conversation`** – Task 3: Conversation
4. **`colorDetection`** – Task 4: Color Detection
5. **`objectDetection`** – Task 5: Object Detection
6. **`attentionprediction`** – Task 6: Attention Prediction

Each task folder contains:

- **Computational or MTurk experiment folders** (non-`Plot`): Implementation of specific experiments
- **`Plot` folder**: Code for result compilation, statistical analysis, and figure plotting

📌 **Note:** In `Plot` folders, Jupyter notebooks follow this execution order:

```plaintext
TaskN_PreCompileData.ipynb → TaskN_Run1_*.ipynb → TaskN_Run2_*.ipynb → ...
```

Always start with `PreCompileData.ipynb` before running `RunX_Y` notebooks in order.

---

### 🧩 Extra Folders

7. **`MiscellaneousData`** – Contains:
   - Data for simple parsing tasks (e.g., text stimulus parsing, result parsing)
   - Example inputs/outputs from computational runs

8. **`MiscellaneousCode`** – Contains:
   - Scripts for:
     - Machine agent experiments (e.g., caption generation using LLaVa, Flamingo, ChatGPT-generated scanpaths)
     - Zero-shot machine judge experiments (e.g., ChatGPT as a zero-shot judge across the six tasks)

---

## 🧪 Examples

### Machine Agent Experiments (in `MiscellaneousCode`)

- Generating image captions with new captioning models (e.g., **LLaVa**, **Flamingo**)
- Using **ChatGPT** to generate captions and **visual scanpaths**

### Zero-Shot Machine Judge Experiments (in `MiscellaneousCode`)

- Deploying **ChatGPT as a judge** across all six tasks in zero-shot settings

### Simple Tasks (in `MiscellaneousData`)

- Parsing text stimuli
- Extracting computational result tables

---

## 🔧 How to Use

1. Navigate to the task of interest (`imageCaptioning`, `conversation`, etc.)
2. Enter the `Plot` subfolder
3. Run the notebooks **in order**, starting from `TaskN_PreCompileData.ipynb`
4. Proceed sequentially with `TaskN_RunX_Y.ipynb` notebooks as they build upon each other

---

## 📬 Contact

For any questions, please reach out to the maintainers or contributors of this repository.
