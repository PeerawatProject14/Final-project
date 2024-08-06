from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# โหลดโมเดล SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')

# อ่านไฟล์ project_with_types.csv
file_path = 'C:/My projects/Final project/Model/project_with_types.csv'
df = pd.read_csv(file_path)

def get_sentence_embeddings(texts):
    """แปลงข้อความเป็น Sentence embeddings"""
    return model.encode(texts, convert_to_tensor=True)

def get_similarities(input_text):
    """คำนวณความเหมือนระหว่างข้อความที่รับเข้ามากับข้อความในไฟล์ CSV"""
    # แปลงข้อความอินพุตเป็น Sentence embeddings
    input_embedding = get_sentence_embeddings([input_text])
    
    # แปลงข้อความในไฟล์ CSV เป็น Sentence embeddings
    df_embeddings = get_sentence_embeddings(df['คำอธิบาย'].tolist())
    
    # คำนวณความเหมือน
    similarities = cosine_similarity(input_embedding, df_embeddings).flatten()
    
    # แปลงค่า similarity เป็นเปอร์เซ็นต์
    similarities_percent = similarities * 100
    
    # สร้างรายการข้อมูล
    results = []
    for index, similarity in enumerate(similarities_percent):
        results.append({
            'Index': index,
            'ประเภท': df.loc[index, 'ประเภท'],
            'คำอธิบาย': df.loc[index, 'คำอธิบาย'],
            'Similarity (%)': similarity
        })
    
    return results

def print_top_5_from_top_category(results):
    """พิมพ์ 5 ตัวที่มีค่าความเหมือนสูงสุดจากประเภทที่มีความเหมือนสูงสุด"""
    # แปลง results เป็น DataFrame ชั่วคราวเพื่อจัดกลุ่ม
    temp_df = pd.DataFrame(results)
    
    # เปลี่ยนประเภทข้อมูลของคอลัมน์ 'Similarity (%)' เป็น float
    temp_df['Similarity (%)'] = temp_df['Similarity (%)'].astype(float)
    
    # ค้นหาประเภทที่มีความเหมือนสูงสุด
    top_category_index = temp_df['Similarity (%)'].idxmax()
    top_category = temp_df.loc[top_category_index, 'ประเภท']
    
    # กรองข้อมูลเพื่อแสดงเฉพาะประเภทที่มีความเหมือนสูงสุด
    top_category_df = temp_df[temp_df['ประเภท'] == top_category]
    
    # ค้นหาข้อมูล 5 ตัวที่มีค่าความเหมือนสูงสุดในประเภทนั้น
    top_entries = top_category_df.nlargest(5, 'Similarity (%)')
    
    # พิมพ์ผลลัพธ์
    print(f"\nประเภทที่มีค่าความเหมือนสูงสุด: {top_category}")
    for _, row in top_entries.iterrows():
        print(f"\nคำอธิบาย: {row['คำอธิบาย']}")
        print(f"ความเหมือน: {row['Similarity (%)']:.2f}%")

# ลูปเพื่อรับข้อความอินพุตจากผู้ใช้
while True:
    # รับข้อความอินพุตจากผู้ใช้
    input_text = input("กรุณาใส่ข้อความเพื่อเปรียบเทียบ (หรือพิมพ์ 'exit' เพื่อออก): ")
    
    # เงื่อนไขออกจากลูป
    if input_text.lower() == 'exit':
        print("ออกจากโปรแกรม.")
        break
    
    # คำนวณความเหมือน
    results = get_similarities(input_text)
    
    # แสดง 5 ตัวที่มีค่าความเหมือนสูงสุดจากประเภทที่มีความเหมือนสูงสุด
    print_top_5_from_top_category(results)
