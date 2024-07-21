import io
import sys
import json
import torch
import pandas as pd
from sentence_transformers import SentenceTransformer

# โหลดโมเดล SentenceTransformer และกำหนดอุปกรณ์
model = SentenceTransformer('sentence-transformers/paraphrase-xlm-r-multilingual-v1')
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)

def get_sentence_embedding(sentence):
    sentence_embedding = model.encode(sentence, convert_to_tensor=True, device=device)
    return sentence_embedding

# อ่านข้อมูลจาก CSV
csv_path = 'C:/Finalproject101/Model/project.csv'
df = pd.read_csv(csv_path)

# กำหนดการเข้ารหัสข้อมูลให้เป็น UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')

# อ่านข้อมูลที่ได้รับจาก stdin
input_data = sys.stdin.read().strip()

# เตรียมผลลัพธ์ที่เป็น array
response = []

if input_data:
    # คำนวณ embedding ของข้อความที่ผู้ใช้ป้อนเข้ามา
    user_embedding = get_sentence_embedding(input_data)
    for index, row in df.iterrows():
        description = row['คำอธิบาย']
        description_embedding = get_sentence_embedding(description)
        similarity = torch.nn.functional.cosine_similarity(user_embedding, description_embedding, dim=0)
        similarity_percentage = similarity.item() * 100
        # เพิ่มข้อมูลลงใน array ของผลลัพธ์
        response.append({'description': description, 'similarity_percentage': similarity_percentage})

    # เรียงลำดับและตัดผลลัพธ์ให้เหลือเพียง 3 รายการที่มีความคล้ายมากที่สุด
    response = sorted(response, key=lambda x: x['similarity_percentage'], reverse=True)[:3]

# แปลงผลลัพธ์เป็น JSON และพิมพ์ออกมา
print(json.dumps(response, ensure_ascii=False))
sys.stdout.flush()
