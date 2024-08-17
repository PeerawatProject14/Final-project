import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# โหลดข้อมูลจากไฟล์ CSV
file_path = 'C:/My projects/Final project/Model/2555_translated.csv'
df = pd.read_csv(file_path)

# ตรวจสอบคอลัมน์และเลือกคอลัมน์ที่ต้องการ
if 'คำอธิบาย' not in df.columns:
    raise ValueError("Column 'คำอธิบาย' does not exist in the data.")

texts = df['คำอธิบาย'].dropna().tolist()

# แปลงข้อความเป็นเวกเตอร์ TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(texts)

# Elbow Method
def plot_elbow(X, max_clusters=500):
    wcss = []
    for i in range(1, max_clusters + 1):
        kmeans = KMeans(n_clusters=i, random_state=42)
        kmeans.fit(X)
        wcss.append(kmeans.inertia_)
        # Print progress for each cluster count
        print(f"Processed {i} clusters for Elbow Method")

    plt.figure(figsize=(12, 8))
    plt.plot(range(1, max_clusters + 1), wcss, marker='o')
    plt.title('Elbow Method for Optimal k')
    plt.xlabel('Number of clusters')
    plt.ylabel('WCSS')
    plt.grid(True)
    plt.show()

# Silhouette Score
def plot_silhouette_scores(X, max_clusters=500):
    silhouette_scores = []
    for i in range(2, max_clusters + 1):  # จำนวนกลุ่มต้องมากกว่า 1
        kmeans = KMeans(n_clusters=i, random_state=42)
        kmeans.fit(X)
        labels = kmeans.labels_
        score = silhouette_score(X, labels)
        silhouette_scores.append(score)
        # Print progress for each cluster count
        print(f"Processed {i} clusters for Silhouette Scores")

    plt.figure(figsize=(12, 8))
    plt.plot(range(2, max_clusters + 1), silhouette_scores, marker='o')
    plt.title('Silhouette Scores for Different Numbers of Clusters')
    plt.xlabel('Number of clusters')
    plt.ylabel('Silhouette Score')
    plt.grid(True)
    plt.show()

# เรียกใช้ฟังก์ชันเพื่อวิเคราะห์จำนวนกลุ่มที่เหมาะสม
plot_elbow(X, max_clusters=500)
plot_silhouette_scores(X, max_clusters=500)
