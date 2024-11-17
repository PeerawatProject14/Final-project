import json
import sys
import mysql.connector
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# กำหนดข้อมูลการเชื่อมต่อกับฐานข้อมูล
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # ใส่รหัสผ่านของคุณ
    'database': 'research_db'
}

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

    target_label = request_data.get('PredictedLabel')
    input_embedding_str = request_data.get('embedding')  # รับ embedding จากอินพุต

    if not target_label or not input_embedding_str:
        output_data = {"error": "PredictedLabel and embedding are required"}
        sys.stdout.buffer.write(json.dumps(output_data, ensure_ascii=False).encode('utf-8'))
        sys.stdout.flush()
        return

    # แปลง string ของ embedding จากอินพุตเป็น numpy array
    input_embedding = np.array(list(map(float, input_embedding_str.strip('[]').split())), dtype=np.float32)

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
    top_results_df = research_df.sort_values(by='similarity', ascending=False).head(11)

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

