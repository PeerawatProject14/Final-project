import pandas as pd
from googletrans import Translator
from tensorflow_hub import load
import numpy as np
import tensorflow as tf
tf.get_logger().setLevel('WARNING')

def translate_to_english(text):
    translator = Translator()
    translated = translator.translate(text, src='th', dest='en')
    return translated.text

def translate_column_to_english(df, column_name):
    translated_texts = []
    for text in df[column_name]:
        translated_texts.append(translate_to_english(text))
    return translated_texts

def process_input(input_text, data):
    WordProcessing = input_text.split()
    encoder = load('https://tfhub.dev/google/universal-sentence-encoder/4')
    input_words = ' '.join(WordProcessing)
    VectorInput = encoder([input_words])[0]

    SimilarityScores = []
    for index, row in data.iterrows():    
        abstract_english = row['คำอธิบาย_อังกฤษ']
        abstract_tokens = abstract_english.split()
        abstract_words = ' '.join(abstract_tokens)
        VectorAbstract = encoder([abstract_words])[0]
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

# โหลดไฟล์ CSV และแปลงคำอธิบายเป็นภาษาอังกฤษ
data = pd.read_csv("D:\Finalproject101\Model\project.csv", encoding='utf-8')
data['คำอธิบาย_อังกฤษ'] = translate_column_to_english(data, 'คำอธิบาย')

while True:
    input_text_thai = input("ป้อนประโยคตัวตั้ง (ภาษาไทย): ")
    input_text_english = translate_to_english(input_text_thai)
    process_input(input_text_english, data)
