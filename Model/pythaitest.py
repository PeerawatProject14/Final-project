# นำเข้าไลบรารีที่จำเป็น
from pythainlp.tokenize import word_tokenize
from transformers import BartTokenizer, BartForConditionalGeneration

# โหลดโมเดลและ tokenizer สำหรับการสรุปประโยค
tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

# ฟังก์ชันเพื่อลดรูปประโยค
def summarize_text(text):
    inputs = tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(
        inputs,
        max_length=150,
        min_length=30,
        length_penalty=2.0,
        num_beams=4,
        early_stopping=True
    )
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

# ฟังก์ชันตัดคำภาษาไทย
def tokenize_text(text):
    tokens = word_tokenize(text, engine='newmm')  # 'newmm' เป็น tokenizer ที่ใช้สำหรับการตัดคำภาษาไทย
    return tokens

# ตัวอย่างข้อความภาษาไทย
text = "วันนี้ผมก็เลยอยากจะลองใช้เทคนิคทาง NLP มาช่วยแก้ไขปัญหานั้น โดยพยายามจะจัดกลุ่มคำที่มีความหมายเหมือนๆกันเอามาไว้ด้วยกัน อยากจะลองประยุกต์ เอา Pre-trained model ที่ถูกเรียกว่า Universal Sentence Encoder (USE) มาลองใช้งานดู สำหรับ Paper ของ USE"

# ตัดคำภาษาไทย
tokens = tokenize_text(text)
print("ข้อความต้นฉบับ:", text)
print("คำที่ตัดออกมา:", tokens)

# สรุปประโยค
summary = summarize_text(text)
print("\nสรุปประโยค:", summary)
