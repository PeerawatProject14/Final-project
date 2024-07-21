import sys
from googletrans import Translator
import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub

# Suppress TensorFlow INFO and WARNING messages
tf.get_logger().setLevel('ERROR')

def translate_to_english(text):
    translator = Translator()
    translated = translator.translate(text, src='th', dest='en')
    return translated.text

def process_input(input_text, data):
    # Load Universal Sentence Encoder
    encoder = hub.load('https://tfhub.dev/google/universal-sentence-encoder/4')

    # Preprocess input text
    input_words = ' '.join(input_text.split())
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

    High = pd.Series(SimilarityScores).nlargest(1).index
    
    print()
    print("ประโยคที่มีความเหมือนมากที่สุด:")
    for index in High:
        SimilarityPercent = SimilarityScores[index] * 100  
        print(f"ความคล้ายคลึง: {SimilarityPercent:.2f}%")
        print(data['คำอธิบาย'][index])  
        print()

# Main function to read input from stdin
def main():
    input_text_thai = sys.stdin.read().strip()
    
    # Load data from CSV
    data = pd.read_csv("D:/Finalproject101/Model/project.csv", encoding='utf-8')
    data['คำอธิบาย_อังกฤษ'] = data['คำอธิบาย'].apply(translate_to_english)

    # Process input text
    process_input(input_text_thai, data)

if __name__ == "__main__":
    main()
