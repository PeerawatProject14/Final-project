import tensorflow as tf
import tensorflow_hub as hub
import numpy as np

# โหลดโมเดล Universal Sentence Encoder จาก TensorFlow Hub

model = hub.load('https://tfhub.dev/google/universal-sentence-encoder/4')

# ข้อความที่ต้องการทดสอบ
sentences = [
    "สวัสดีครับ",
    "วันนี้อากาศดี",
    "ฉันชอบการเรียนรู้เกี่ยวกับการเรียนรู้ของเครื่อง",
    "การเขียนโปรแกรมเป็นสิ่งที่สนุก",
    "การเรียนรู้ของเครื่องเป็นส่วนหนึ่งของปัญญาประดิษฐ์"
]

# แปลงข้อความเป็นเวกเตอร์
def get_sentence_embedding(sentences):
    embeddings = model(sentences)
    return embeddings

# คำนวณเวกเตอร์ของประโยค
embeddings = get_sentence_embedding(sentences)

# แสดงผลลัพธ์เวกเตอร์
for i, sentence in enumerate(sentences):
    print(f"ประโยค: {sentence}")
    print(f"เวกเตอร์ (shape={embeddings[i].shape}): {embeddings[i].numpy()}\n")
