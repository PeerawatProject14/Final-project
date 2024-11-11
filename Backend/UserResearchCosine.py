import json
import sys
import mysql.connector
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
import torch

# กำหนดข้อมูลการเชื่อมต่อกับฐานข้อมูล
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # ใส่รหัสผ่านของคุณ
    'database': 'research_db'
}

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
    # ทำการ tokenization ข้อความ
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

# ฟังก์ชันสำหรับดึงข้อมูลจากฐานข้อมูลที่มี PredictedLabel ตรงกับเงื่อนไข
def fetch_research_by_label(label):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)

    query = "SELECT id, name, description, PredictedLabel, embedding FROM research WHERE PredictedLabel = %s"
    cursor.execute(query, (label,))
    research_data = cursor.fetchall()

    cursor.close()
    connection.close()

    return pd.DataFrame(research_data)

# ฟังก์ชัน main สำหรับรันโปรแกรม
def main():
    # รับข้อมูล JSON จาก stdin
    input_data = sys.stdin.read().strip()
    request_data = json.loads(input_data)

    input_description = request_data.get('description')  # ข้อความที่ส่งเข้ามา

    if not input_description:
        output_data = {"error": "Description is required"}
        sys.stdout.buffer.write(json.dumps(output_data, ensure_ascii=False).encode('utf-8'))
        sys.stdout.flush()
        return

    # ขั้นตอน predict label ของข้อความ
    target_label = predict_label(input_description)

    # สร้าง embedding ของข้อความ input
    input_embedding = generate_embedding(input_description)

    # ดึงข้อมูลจากฐานข้อมูลที่มี label ตรงกัน
    research_df = fetch_research_by_label(target_label)

    if research_df.empty:
        output_data = {"error": "No matching records found"}
        sys.stdout.buffer.write(json.dumps(output_data, ensure_ascii=False).encode('utf-8'))
        sys.stdout.flush()
        return

    # แปลง embedding ในฐานข้อมูลให้เป็น numpy array
    def parse_embedding(embedding_str):
        return np.array(list(map(float, embedding_str.strip('[]').split())), dtype=np.float32)

    # ดึง embedding ของทุกแถวใน DataFrame
    research_df['embedding'] = research_df['embedding'].apply(parse_embedding)

    # คำนวณ cosine similarity ระหว่าง embedding ที่ส่งมาและทุกๆ embedding ในฐานข้อมูล
    similarities = calculate_cosine_similarity(input_embedding, research_df['embedding'])

    # เพิ่มค่า similarity ลงใน DataFrame
    research_df['similarity'] = similarities

    # เรียงตาม similarity จากมากไปน้อยและเลือกแค่ 10 แถวแรก
    top_results_df = research_df.sort_values(by='similarity', ascending=False).head(10)

    # แปลงผลลัพธ์เป็น JSON รวมทุกคอลัมน์
    # เปลี่ยน ndarray เป็น list เพื่อให้สามารถแปลงเป็น JSON ได้
    output_data = {
        'target_label': target_label,
        'results': top_results_df.to_dict(orient='records')  # ส่งออกทุกคอลัมน์
    }

    # แปลง ndarray ใน results ให้เป็น list ก่อนส่งออก
    for result in output_data['results']:
        result['embedding'] = result['embedding'].tolist()  # แปลงเป็น list

    # ส่งข้อมูล JSON กลับไปยัง Node.js
    sys.stdout.buffer.write(json.dumps(output_data, ensure_ascii=False).encode('utf-8'))
    sys.stdout.flush()

if __name__ == '__main__':
    main()
