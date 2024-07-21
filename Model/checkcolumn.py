import pandas as pd

# โหลดไฟล์ CSV
data = pd.read_csv("D:\Finalproject101\project.csv", encoding='utf-8')

# แสดงรายชื่อคอลัมน์
print(data.columns)