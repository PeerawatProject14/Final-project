import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn import metrics

# โหลดข้อมูลจากไฟล์ CSV (จำกัดแถวที่โหลด)
file_path = 'C:/My projects/Final project/Model/project.csv'
data = pd.read_csv(file_path, nrows=1000)  # โหลดเฉพาะ 1000 แถวแรก

# ตรวจสอบข้อมูลและจัดการค่าที่เป็น NaN
data['คำอธิบาย'] = data['คำอธิบาย'].fillna('')

# สร้างฟังก์ชันเพื่อสร้างป้ายชื่อ (labels) สำหรับประเภทงานวิจัย
def create_labels(text):
    if not isinstance(text, str):  # ตรวจสอบว่าข้อความเป็นชนิด str
        return 'ทั่วไป'
    text = text.lower()  # เปลี่ยนข้อความให้เป็นตัวพิมพ์เล็กเพื่อให้การตรวจสอบแม่นยำยิ่งขึ้น

    # Computer Science
    if any(keyword in text for keyword in [
        'ai', 'machine learning', 'data science', 'computer vision', 'natural language processing',
        'deep learning', 'neural networks', 'big data', 'cloud computing', 'artificial intelligence', 
        'software engineering', 'cybersecurity', 'internet of things', 'iot',
        'เว็บแอปพลิเคชั่น', 'โมบายแอป', 'web application', 'mobile app', 'software development',
        'โปรแกรมมิ่ง', 'ปัญญาประดิษฐ์', 'algorithm', 'computer science']):
        return 'วิทยาการคอมพิวเตอร์'
    
    # Engineering
    elif any(keyword in text for keyword in [
        'วิศวกรรม', 'เครื่องกล', 'วิศวกรรมโยธา', 'วิศวกรรมเครื่องกล', 'วิศวกรรมเคมี', 
        'วิศวกรรมอากาศยาน', 'การออกแบบ', 'การผลิต', 'วิศวกรรมไฟฟ้า', 'วิศวกรรมสิ่งแวดล้อม',
        'วิศวกรรมการขนส่ง', 'วิศวกรรมพลังงาน', 'วิศวกรรมการผลิต', 'engineering management']):
        return 'วิศวกรรม'
    
    # Health Sciences
    elif any(keyword in text for keyword in [
        'สุขภาพ', 'การแพทย์', 'ผู้ป่วย', 'clinical research', 'public health', 'epidemiology',
        'การวินิจฉัยโรค', 'การบำบัด', 'การฟื้นฟู', 'จิตวิทยา', 'การแพทย์ฉุกเฉิน',
        'medicinal research', 'pharmacology', 'biotechnology', 'genomics', 'pathology',]):
        return 'วิทยาศาสตร์สุขภาพ'
    
    # Natural Sciences
    elif any(keyword in text for keyword in [
        'ฟิสิกส์', 'เคมี', 'ชีววิทยา', 'วิทยาศาสตร์โลก', 'ดาราศาสตร์', 'วิทยาศาสตร์วัสดุ',
        'สิ่งแวดล้อม', 'เคมีวิเคราะห์', 'ฟิสิกส์อนุภาค', 'นาโนเทคโนโลยี', 'ภูมิศาสตร์', 'คลื่นแม่เหล็กไฟฟ้า']):
        return 'วิทยาศาสตร์ธรรมชาติ'
    
    # Social Sciences
    elif any(keyword in text for keyword in [
        'สังคม', 'เศรษฐศาสตร์', 'ชุมชน', 'sociology', 'anthropology', 'political science',
        'การศึกษาสังคม', 'การวิเคราะห์สังคม', 'พฤติกรรมมนุษย์', 'public policy', 'sociocultural',
        'criminology', 'human geography']):
        return 'สังคมศาสตร์'
    
    # Humanities
    elif any(keyword in text for keyword in [
        'ประวัติศาสตร์', 'ศิลปะ', 'ปรัชญา', 'วรรณกรรม', 'ศึกษาวัฒนธรรม', 'ประวัติศาสตร์ศิลปะ',
        'ภาษาศาสตร์', 'ศิลปะการแสดง', 'วรรณกรรมเปรียบเทียบ', 'theology', 'cultural studies',
        'classical studies', 'art history', 'literary theory']):
        return 'มนุษยศาสตร์'
    
    # Management
    elif any(keyword in text for keyword in [
        'การจัดการ', 'ธุรกิจ', 'management', 'business administration', 'operations management',
        'human resource management', 'การวางแผนธุรกิจ', 'การจัดการโครงการ', 'strategic management',
        'project management', 'supply chain management', 'marketing']):
        return 'การจัดการ'
    
    # Technology and Innovation
    elif any(keyword in text for keyword in [
        'เทคโนโลยี', 'นวัตกรรม', 'innovation', 'technology', 'iot',
        'การพัฒนาเทคโนโลยี', 'การวิจัยและพัฒนา', 'เทคโนโลยีสารสนเทศ', 'robotics','อัตโนมัติ','ระบบควบคุม','เครื่องทดสอบ','ระบบผลิต',]):
        return 'เทคโนโลยีและนวัตกรรม'
    
    elif any(keyword in text for keyword in [
        'เครื่องสร้าง','เครื่องผลิต','เครื่องจักร','เครื่องกำเนิด',]):
        return 'เครื่องจักรกล'
    
    elif any(keyword in text for keyword in [
        'เกษตรกร','เพาะปลูก','ปลูก','การเกษตร','ผลผลิต',]):
        return 'การเกษตร'
    
    
    else:
        return 'ทั่วไป'

# สร้างคอลัมน์ "ประเภท" โดยใช้ฟังก์ชัน create_labels
data['ประเภท'] = data['คำอธิบาย'].apply(create_labels)

# แยกคอลัมน์ "คำอธิบาย" และ "ประเภท"
sentences = data['คำอธิบาย']
labels = data['ประเภท']

# แบ่งข้อมูลเป็นชุดฝึกอบรมและชุดทดสอบ
X_train, X_test, y_train, y_test = train_test_split(sentences, labels, test_size=0.2, random_state=42)

# สร้าง pipeline ที่รวมการแปลงข้อความและโมเดลการจำแนกประเภท
model = make_pipeline(CountVectorizer(), MultinomialNB())

# ฝึกอบรมโมเดล
model.fit(X_train, y_train)

# ทำนายประเภทของประโยคในชุดทดสอบ
predicted_labels = model.predict(X_test)

# คำนวณและแสดงผลการประเมินผล
accuracy = metrics.accuracy_score(y_test, predicted_labels)
precision = metrics.precision_score(y_test, predicted_labels, average='weighted')
recall = metrics.recall_score(y_test, predicted_labels, average='weighted')
f1_score = metrics.f1_score(y_test, predicted_labels, average='weighted')

print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1 Score: {f1_score:.2f}")

# ทำนายประเภทของประโยคทั้งหมด
all_predicted_labels = model.predict(sentences)

# จัดกลุ่มประโยคตามประเภทที่คาดการณ์
grouped_sentences = data.copy()
grouped_sentences['Predicted_Category'] = all_predicted_labels

# ฟังก์ชันเพื่อดึงข้อความไม่เกิน 150 ตัวอักษร
def truncate_text(text, max_length=150):
    return text[:max_length] + ('...' if len(text) > max_length else '')

# แสดงผลลัพธ์การจัดกลุ่ม
print("\nSentences grouped by predicted category (showing only first 150 characters of each description):")
for category in grouped_sentences['Predicted_Category'].unique():
    print(f"\nCategory: {category}")
    category_sentences = grouped_sentences[grouped_sentences['Predicted_Category'] == category]['คำอธิบาย']
    for i, sentence in enumerate(category_sentences, start=1):
        short_sentence = truncate_text(sentence)
        print(f"{i}. {short_sentence}")

# บันทึก DataFrame ที่มีคอลัมน์ "ประเภท" และ "Predicted_Category" ลงในไฟล์ CSV ใหม่
output_file_path = 'C:/My projects/Final project/Model/project_with_predicted_categories.csv'
grouped_sentences.to_csv(output_file_path, index=False)
