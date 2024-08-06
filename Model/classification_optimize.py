import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder

ref_path = 'C:/My projects/Final project/Model/ref.csv'
ref_df = pd.read_csv(ref_path)

project_path = 'C:/My projects/Final project/Model/project.csv'
project_df = pd.read_csv(project_path)

# เตรียมข้อมูลสำหรับการฝึกโมเดล
X_train = ref_df['เนื้อหางานวิจัย']
y_train = ref_df['ประเภท']

# แปลงประเภทเป็นตัวเลข
label_encoder = LabelEncoder()
y_train_encoded = label_encoder.fit_transform(y_train)

# สร้าง Pipeline สำหรับการจัดประเภทข้อความ
model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

# ฝึกโมเดล
model.fit(X_train, y_train_encoded)

# ทำนายประเภทของงานวิจัยใน project.csv
X_test = project_df['คำอธิบาย']
y_pred_encoded = model.predict(X_test)

# แปลงผลลัพธ์การทำนายกลับเป็นประเภท
y_pred = label_encoder.inverse_transform(y_pred_encoded)

# เพิ่มคอลัมน์ประเภทใน DataFrame
project_df['ประเภท'] = y_pred

# บันทึกผลลัพธ์
output_path = 'C:/My projects/Final project/Model/project_with_types.csv'
project_df.to_csv(output_path, index=False)

# แสดงสมาชิกของแต่ละประเภท
print("สมาชิกของแต่ละประเภท (แสดงเฉพาะ 150 ตัวอักษรแรก):\n")
for category in project_df['ประเภท'].unique():
    print(f'ประเภท: {category}')
    members = project_df[project_df['ประเภท'] == category]['คำอธิบาย']
    if members.empty:
        print("  ไม่มีสมาชิกในประเภทนี้")
    else:
        for i, member in enumerate(members, start=1):
            print(f"  สมาชิก {i}: {member[:200]}...")
            print('---')
    print("\n" + "="*50 + "\n")

print(f'ผลลัพธ์ถูกบันทึกไว้ที่ {output_path}')
