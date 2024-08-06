import pandas as pd
from googletrans import Translator
from concurrent.futures import ThreadPoolExecutor
from functools import partial

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

# Load data and translate the description column
data = pd.read_csv("C:/My projects/Final project/Model/project.csv", encoding='utf-8')
data['คำอธิบาย_อังกฤษ'] = translate_column_to_english(data, 'คำอธิบาย')

# Display the results
print("Translated descriptions:")
for index, row in data.iterrows():
    print(f"Original: {row['คำอธิบาย']}")
    print(f"Translated: {row['คำอธิบาย_อังกฤษ']}")
    print()

print("Translation complete.")
