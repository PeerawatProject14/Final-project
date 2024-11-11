import json
import torch
from transformers import AutoTokenizer, AutoModel
import numpy as np
import sys

# โหลด tokenizer และโมเดลที่ใช้สำหรับสร้าง embedding
tokenizer = AutoTokenizer.from_pretrained('Peerawat2024/AmbatronBERTa')
embedding_model = AutoModel.from_pretrained('Peerawat2024/AmbatronBERTa')

# ฟังก์ชันสำหรับแปลงข้อความเป็น embedding
def generate_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=512)

    # สร้าง embeddings โดยใช้ model
    with torch.no_grad():  # ปิดการคำนวณ gradients เพื่อประหยัดหน่วยความจำ
        outputs = embedding_model(**inputs)

    # ใช้ output แรก (embedding ของ [CLS] token)
    cls_embedding = outputs.last_hidden_state[:, 0, :].numpy()

    return cls_embedding.flatten()  # แปลงเป็น numpy array และ flatten

# รับข้อมูล JSON จาก stdin
def process_request(input_data):
    try:
        # แปลงข้อมูล JSON ที่ได้รับ
        request_data = json.loads(input_data)

        # ดึงค่าจาก request_data โดยเฉพาะ description
        description = request_data.get('description')
        if not description:
            return json.dumps({"error": "'description' is required in the input data."})

        # ขั้นตอนการแปลงข้อความเป็น embedding
        embedding = generate_embedding(description)

        # สร้างผลลัพธ์ที่ต้องการส่งกลับ
        result = {
            "embedding": embedding.tolist()  # แปลง numpy array เป็น list
        }

        # ส่งผลลัพธ์กลับ
        return json.dumps(result, ensure_ascii=False)

    except json.JSONDecodeError as e:
        return json.dumps({"error": f"Invalid JSON format: {str(e)}"})
    except Exception as e:
        return json.dumps({"error": str(e)})

# เรียกใช้งานฟังก์ชันจาก stdin
if __name__ == '__main__':
    input_data = sys.stdin.read().strip()  # รับข้อมูลจาก stdin
    response = process_request(input_data)
    print(response)  # ส่งข้อมูลออกทาง stdout
