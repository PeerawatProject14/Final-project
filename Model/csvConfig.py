import pandas as pd

# อ่านไฟล์ CSV
file_path = 'C:/My projects/Final project/Model/project.csv'
df = pd.read_csv(file_path)

# ตรวจสอบคอลัมน์ 'คำอธิบาย' ว่ามีค่าเป็นค่าว่างหรือไม่
missing_values = df[df['คำอธิบาย'].isna()]

# แสดงผลลัพธ์
if missing_values.empty:
    print("ไม่มีบรรทัดที่คอลัมน์ 'คำอธิบาย' เป็นค่าว่าง")
else:
    print("บรรทัดที่มีค่าว่างในคอลัมน์ 'คำอธิบาย':")
    print(missing_values)
    
    # แสดงตำแหน่งของบรรทัดที่มีค่าเป็นค่าว่าง
    print("\nตำแหน่งของบรรทัดที่มีค่าว่างในคอลัมน์ 'คำอธิบาย':")
    print(missing_values.index.tolist())
    
    # การนับจำนวนของบรรทัดที่มีค่าว่าง
    count_missing = missing_values.shape[0]
    print(f"\nจำนวนบรรทัดที่มีค่าว่างในคอลัมน์ 'คำอธิบาย': {count_missing}")
    
    # แสดงข้อมูลเพิ่มเติม (ตัวอย่างการแสดงข้อมูลอื่น ๆ ถ้าต้องการ)
    print("\nตัวอย่างข้อมูลที่มีค่าว่าง:")
    print(missing_values.head())
