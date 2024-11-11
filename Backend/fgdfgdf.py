import json
import torch
from transformers import AutoTokenizer, AutoModel
import numpy as np

# โหลด tokenizer และโมเดลที่ใช้สำหรับสร้าง embedding
tokenizer = AutoTokenizer.from_pretrained('Peerawat2024/AmbatronBERTa')
embedding_model = AutoModel.from_pretrained('Peerawat2024/AmbatronBERTa')

# ฟังก์ชันสำหรับแปลงข้อความเป็น embedding
def generate_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True)

    # สร้าง embeddings โดยใช้ model
    with torch.no_grad():  # ปิดการคำนวณ gradients เพื่อประหยัดหน่วยความจำ
        outputs = embedding_model(**inputs)

    # ใช้ output แรก (embedding ของ [CLS] token)
    cls_embedding = outputs.last_hidden_state[:, 0, :].numpy()

    return cls_embedding.flatten()  # แปลงเป็น numpy array และ flatten

def main():
    try:
        # รับข้อมูล JSON จากผู้ใช้ผ่าน input()
        input_data = input("กรุณากรอกข้อมูล JSON: ").strip()

        # แปลงข้อมูล JSON
        request_data = json.loads(input_data)  # แปลงข้อมูล JSON เป็น dictionary

        # ดึงค่าจาก request_data โดยเฉพาะ description
        description = request_data.get('description')
        if not description:
            print("Error: 'description' is required in the input data.")
            return

        # แสดงผล description
        print(f"Description: {description}")

        # ขั้นตอนการแปลงข้อความเป็น embedding
        embedding = generate_embedding(description)
        print("Embedding generated successfully!")
        print(f"Embedding (first 10 elements): {embedding[:10]}")  # แสดงแค่ 10 ค่าแรกของ embedding

    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format. {str(e)}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    main()
