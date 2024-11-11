import json
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
import torch

# โหลด tokenizer และโมเดลที่ใช้สำหรับการพยากรณ์ label
tokenizer = AutoTokenizer.from_pretrained('Peerawat2024/AmbatronBERTa')
model_for_label = AutoModelForSequenceClassification.from_pretrained('Peerawat2024/AmbatronBERTa')

# โหลดโมเดลสำหรับการสร้าง embedding
embedding_model = AutoModel.from_pretrained('Peerawat2024/AmbatronBERTa')

# ฟังก์ชันสำหรับ predict label ของข้อความ
def predict_label(text):
    inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True, padding=True)
    outputs = model_for_label(**inputs)
    logits = outputs.logits  # ได้ logits จากโมเดลที่มีหัวการพยากรณ์
    predicted_label = torch.argmax(logits, dim=1).item()
    return predicted_label  

# ฟังก์ชันสำหรับแปลงข้อความเป็น embedding
def generate_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True)

    # สร้าง embeddings โดยใช้ model
    with torch.no_grad():  # ปิดการคำนวณ gradients เพื่อประหยัดหน่วยความจำ
        outputs = embedding_model(**inputs)

    # ใช้ output แรก (embedding ของ [CLS] token)
    cls_embedding = outputs.last_hidden_state[:, 0, :].numpy()

    return cls_embedding.flatten()  # แปลงเป็น numpy array และ flatten

# ฟังก์ชันสำหรับคำนวณ cosine similarity ระหว่าง embedding ที่ส่งมาและในฐานข้อมูล
def calculate_cosine_similarity(input_embedding, db_embeddings):
    similarities = []
    for db_embedding in db_embeddings:
        sim = cosine_similarity([input_embedding], [db_embedding])[0][0]
        similarities.append(sim)
    return similarities

# ข้อมูลจำลอง (mock data) สำหรับการทดสอบ
mock_data = [
    {'id': 1, 'name': 'Research 1', 'description': 'This is a research description about AI.', 'PredictedLabel': 0, 'embedding': np.random.rand(768).tolist()},
    {'id': 2, 'name': 'Research 2', 'description': 'A deep dive into machine learning technologies.', 'PredictedLabel': 1, 'embedding': np.random.rand(768).tolist()},
    {'id': 3, 'name': 'Research 3', 'description': 'Exploring the future of robotics and automation.', 'PredictedLabel': 0, 'embedding': np.random.rand(768).tolist()},
    {'id': 4, 'name': 'Research 4', 'description': 'Understanding deep neural networks and AI applications.', 'PredictedLabel': 1, 'embedding': np.random.rand(768).tolist()},
]

# แปลงข้อมูล mock_data ให้เป็น DataFrame
research_df = pd.DataFrame(mock_data)

# ฟังก์ชัน main สำหรับรันโปรแกรม
def main():
    # รับข้อมูล description จากผู้ใช้
    input_description = input("กรุณากรอกคำอธิบายที่ต้องการค้นหา: ").strip()

    if not input_description:
        print("Error: Description is required")
        return

    # เช็คให้มั่นใจว่า input_description ไม่มีค่าที่เป็น NaN หรือว่าง
    if not input_description:
        print("Error: Description cannot be empty")
        return

    # ขั้นตอน predict label ของข้อความ
    try:
        target_label = predict_label(input_description)
        print(f"Predicted Label: {target_label}")  # แสดงผล label ที่พยากรณ์ออกมา
    except ValueError as e:
        print(f"Error: {e}")
        return

    # สร้าง embedding ของข้อความ input
    input_embedding = generate_embedding(input_description)

    # แปลง embedding ใน DataFrame ให้เป็น numpy array
    research_df['embedding'] = research_df['embedding'].apply(lambda x: np.array(x, dtype=np.float32))

    # คำนวณ cosine similarity ระหว่าง embedding ที่ส่งมาและทุกๆ embedding ใน DataFrame
    similarities = calculate_cosine_similarity(input_embedding, research_df['embedding'])

    # เพิ่มค่า similarity ลงใน DataFrame
    research_df['similarity'] = similarities

    # เรียงตาม similarity จากมากไปน้อยและเลือกแค่ 10 แถวแรก
    top_results_df = research_df.sort_values(by='similarity', ascending=False).head(10)

    # แสดงผลลัพธ์
    print("ผลลัพธ์ที่ค้นหา:")
    for index, row in top_results_df.iterrows():
        print(f"ID: {row['id']}, Name: {row['name']}, Similarity: {row['similarity']:.4f}")
        print(f"Description: {row['description']}\n")

if __name__ == '__main__':
    main()
