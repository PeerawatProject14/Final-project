from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
import torch

# โหลด SentenceTransformer โมเดลที่ฝึกมาแล้วสำหรับหลายภาษา (รวมถึงภาษาไทยและภาษาอังกฤษ)
model = SentenceTransformer('sentence-transformers/paraphrase-xlm-r-multilingual-v1')  # Multilingual model

# ตรวจสอบว่ามี CUDA GPU หรือไม่
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

# ฟังก์ชันเพื่อแปลงประโยคเป็นเวกเตอร์
def get_sentence_embedding(sentence):
    # รับเวกเตอร์ของประโยค
    sentence_embedding = model.encode(sentence, convert_to_tensor=True, device=device)
    return sentence_embedding

# โหลดข้อมูลจากไฟล์ CSV
csv_path = 'D:/Finalproject101/Model/project.csv'  # ปรับ path ตามที่อยู่จริงของไฟล์
df = pd.read_csv(csv_path)

# รับอินพุตจากผู้ใช้
user_input = input("กรุณาป้อนข้อความที่ต้องการเปรียบเทียบ: ")

# รับเวกเตอร์สำหรับข้อความที่ป้อน
user_embedding = get_sentence_embedding(user_input)

# สร้างลิสต์เก็บความคล้ายคลึงและคำอธิบาย
similarities = []

# เปรียบเทียบกับคอลัมน์ 'คำอธิบาย' ในไฟล์ CSV
for index, row in df.iterrows():
    description = row['คำอธิบาย']
    
    # รับเวกเตอร์สำหรับคำอธิบาย
    description_embedding = get_sentence_embedding(description)
    
    # คำนวณ Cosine Similarity
    similarity = torch.nn.functional.cosine_similarity(user_embedding, description_embedding, dim=0)
    
    # แปลงความคล้ายคลึงเป็นเปอร์เซ็นต์
    similarity_percentage = similarity.item() * 100
    
    # เพิ่มความคล้ายคลึงและคำอธิบายลงในลิสต์
    similarities.append((description, similarity_percentage))

# เรียงลำดับความคล้ายคลึงจากมากไปหาน้อย
similarities.sort(key=lambda x: x[1], reverse=True)

# แสดง 3 คำอธิบายที่คล้ายคลึงที่สุด
print("\nคำอธิบายที่คล้ายคลึงที่สุด 3 อันดับแรก:")
for i, (description, percentage) in enumerate(similarities[:3]):
    print(f"\nอันดับที่ {i + 1}: {description}")
    print(f"ความคล้ายคลึงเป็นเปอร์เซ็นต์: {percentage:.2f}%")
