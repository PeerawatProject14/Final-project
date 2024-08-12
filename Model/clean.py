import pandas as pd
import re
from mtranslate import translate

# กำหนดที่อยู่ของไฟล์ CSV
file_path = r'C:\Users\admin\OneDrive\เอกสาร\GitHub\Final-project\Model\2555_cleaned.csv'

# อ่านไฟล์ CSV โดยใช้การเข้ารหัส utf-8-sig
df = pd.read_csv(file_path, encoding='utf-8-sig')

# ฟังก์ชันตรวจสอบว่าข้อความมีภาษาไทยหรือไม่
def contains_thai(text):
    # เช็คว่าข้อความมีตัวอักษรภาษาไทยหรือไม่
    return bool(re.search(r'[\u0E00-\u0E7F]', str(text)))

# ฟังก์ชันแปลข้อความจากภาษาอังกฤษเป็นภาษาไทย
def translate_text(text):
    try:
        return translate(text, 'th')
    except Exception as e:
        return text  # ถ้าแปลไม่ได้ ให้คืนค่าข้อความเดิม

# ตัวนับสำหรับบรรทัดที่ถูกแปล
translated_count = 0

# ฟังก์ชันที่ใช้ในการแปลและนับจำนวนแถวที่แปลแล้ว
def translate_and_count(row):
    global translated_count
    if not contains_thai(row):
        translated_count += 1
        translated_text = translate_text(row)
        print(f"แปลไปแล้ว {translated_count} บรรทัด")
        print(f"ข้อความเดิม: {row}")
        print(f"ข้อความที่แปล: {translated_text}\n")
        return translated_text
    else:
        return row

# แปลเฉพาะแถวที่ไม่มีภาษาไทยในคอลัมน์ "คำอธิบาย"
df['คำอธิบาย'] = df['คำอธิบาย'].apply(translate_and_count)

# บันทึกเป็นไฟล์ CSV ใหม่ โดยใช้การเข้ารหัส utf-8-sig
output_file_path = r'C:\Users\admin\OneDrive\เอกสาร\GitHub\Final-project\Model\2555_translated.csv'
df.to_csv(output_file_path, index=False, encoding='utf-8-sig')

print(f'สร้างไฟล์ {output_file_path} สำเร็จ')
print(f'แปลทั้งหมด {translated_count} บรรทัด')
