import json
import sys
import mysql.connector

# กำหนดข้อมูลการเชื่อมต่อกับฐานข้อมูล
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # ใส่รหัสผ่านของคุณ
    'database': 'research_db'
}

def fetch_research_by_label(label):
    # สร้างการเชื่อมต่อฐานข้อมูล
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)

    # ค้นหาข้อมูลที่มี PredictedLabel ตรงกับ label ที่รับเข้ามา
    query = "SELECT * FROM research WHERE PredictedLabel = %s"
    cursor.execute(query, (label,))
    research_data = cursor.fetchall()

    # ปิดการเชื่อมต่อ
    cursor.close()
    connection.close()

    return research_data

def main():
    # รับข้อมูล JSON จาก stdin
    input_data = sys.stdin.read().strip()
    request_data = json.loads(input_data)

    # รับค่า label จากข้อมูลที่ส่งมา
    target_label = request_data.get('PredictedLabel')

    if not target_label:
        output_data = {"error": "Label is required"}
        sys.stdout.buffer.write(json.dumps(output_data, ensure_ascii=False).encode('utf-8'))
        sys.stdout.flush()
        return

    # ดึงข้อมูลจากฐานข้อมูลที่มี label ตรงกัน
    matching_research = fetch_research_by_label(target_label)

    # สร้างผลลัพธ์ที่ต้องการส่งกลับไปยัง Node.js
    output_data = {
        'target_label': target_label,
        'matching_research': matching_research  # ข้อมูลทั้งหมดที่ตรงกัน
    }

    # ส่งข้อมูล JSON กลับไปยัง Node.js
    sys.stdout.buffer.write(json.dumps(output_data, ensure_ascii=False).encode('utf-8'))
    sys.stdout.flush()

if __name__ == '__main__':
    main()
