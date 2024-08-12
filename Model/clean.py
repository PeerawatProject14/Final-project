import pandas as pd

# กำหนดที่อยู่ของไฟล์ CSV
file_path = r'C:\Users\admin\OneDrive\เอกสาร\GitHub\Final-project\Model\2555.csv'

# อ่านไฟล์ CSV โดยใช้การเข้ารหัส utf-8-sig
df = pd.read_csv(file_path, encoding='utf-8-sig')

# ลบแถวที่มีค่าว่างในคอลัมน์ "คำอธิบาย"
df_cleaned = df.dropna(subset=['คำอธิบาย'])

# บันทึกเป็นไฟล์ CSV ใหม่ โดยใช้การเข้ารหัส utf-8-sig
output_file_path = r'C:\Users\admin\OneDrive\เอกสาร\GitHub\Final-project\Model\2555_cleaned.csv'
df_cleaned.to_csv(output_file_path, index=False, encoding='utf-8-sig')

print(f'สร้างไฟล์ {output_file_path} สำเร็จ')
