import pandas as pd
from googletrans import Translator
from tensorflow_hub import load
import numpy as np
import tensorflow as tf
from concurrent.futures import ThreadPoolExecutor
from functools import partial

# Load Universal Sentence Encoder only once
encoder = load('https://tfhub.dev/google/universal-sentence-encoder/4')

# Function to translate text
def translate_to_english(text, translator):
    translated = translator.translate(text, src='th', dest='en')
    return translated.text

# Function to translate a column in DataFrame
def translate_column_to_english(df, column_name):
    translator = Translator()
    translated_texts = []
    with ThreadPoolExecutor() as executor:
        translate_func = partial(translate_to_english, translator=translator)
        translated_texts = list(executor.map(translate_func, df[column_name]))
    return translated_texts

# Function to process input and find similarity scores
def process_input(input_text, data, encoder):
    WordProcessing = input_text.split()
    input_words = ' '.join(WordProcessing)
    VectorInput = encoder([input_words])[0]

    SimilarityScores = []
    for index, row in data.iterrows():    
        VectorAbstract = encoder([row['คำอธิบาย_อังกฤษ']])[0]
        similarity = np.dot(VectorInput, VectorAbstract) / (np.linalg.norm(VectorInput) * np.linalg.norm(VectorAbstract))
        similarity = max(0, similarity)
        SimilarityScores.append(similarity)

    High = pd.Series(SimilarityScores).nlargest(3).index

    print()
    print("ประโยคที่มีความเหมือนมากที่สุด:")
    for index in High:
        SimilarityPercent = SimilarityScores[index] * 100  
        print(f"ความคล้ายคลึง: {SimilarityPercent:.2f}%")
        print(data['คำอธิบาย'][index])  
        print()

# Load data and translate the description column
data = pd.read_csv("D:\Finalproject101\Model\project.csv", encoding='utf-8')
data['คำอธิบาย_อังกฤษ'] = translate_column_to_english(data, 'คำอธิบาย')

while True:
    input_text_thai = input("ป้อนประโยคตัวตั้ง (ภาษาไทย): ")
    translator = Translator()  # กำหนด translator ใหม่ทุกครั้งที่วน loop
    input_text_english = translate_to_english(input_text_thai, translator)
    process_input(input_text_english, data, encoder)
