import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score

# โหลดข้อมูลจากไฟล์ CSV
file_path = r'C:/My projects/Final project/Model/2555_translated.csv'
df = pd.read_csv(file_path)

# ตรวจสอบคอลัมน์และเลือกคอลัมน์ที่ต้องการ
if 'คำอธิบาย' not in df.columns:
    raise ValueError("Column 'คำอธิบาย' does not exist in the data.")

texts = df['คำอธิบาย'].dropna().tolist()

# แปลงข้อความเป็นเวกเตอร์ด้วย sentence-transformers
model = SentenceTransformer('all-roberta-large-v1')

# เข้ารหัสข้อความ
def encode_texts(texts, model):
    embeddings = []
    for i, text in enumerate(texts):
        print(f"กำลังเข้ารหัสแถวที่ {i + 1} / {len(texts)}")
        embedding = model.encode(text, convert_to_tensor=False)
        embeddings.append(embedding)
    return embeddings

X = encode_texts(texts, model)

# Elbow Method
def plot_elbow(X, max_clusters=200):
    wcss = []
    for i in range(1, max_clusters + 1):
        kmeans = KMeans(n_clusters=i, init='k-means++', random_state=42, max_iter=300, n_init=10)
        kmeans.fit(X)
        wcss.append(kmeans.inertia_)
        print(f"Processed {i} clusters for Elbow Method")

    plt.figure(figsize=(12, 8))
    plt.plot(range(1, max_clusters + 1), wcss, marker='o')
    
    x = np.arange(1, max_clusters + 1)
    y = np.array(wcss)
    dy = np.diff(y)
    ddy = np.diff(dy)
    elbow_index = np.argmin(ddy) + 1
    
    plt.axvline(x=elbow_index, color='r', linestyle='--', label=f'Elbow at k={elbow_index}')
    plt.title('Elbow Method for Optimal k')
    plt.xlabel('Number of clusters')
    plt.ylabel('WCSS')
    plt.grid(True)
    plt.legend()
    plt.show()
    
    print(f"Suggested number of clusters based on Elbow Method: {elbow_index}")

# Silhouette Score
def plot_silhouette_scores(X, max_clusters=200):
    silhouette_scores = []
    for i in range(2, max_clusters + 1):  # จำนวนกลุ่มต้องมากกว่า 1
        kmeans = KMeans(n_clusters=i, init='k-means++', random_state=42, max_iter=300, n_init=10)
        kmeans.fit(X)
        labels = kmeans.labels_
        score = silhouette_score(X, labels)
        silhouette_scores.append(score)
        print(f"Processed {i} clusters for Silhouette Scores")

    plt.figure(figsize=(12, 8))
    plt.plot(range(2, max_clusters + 1), silhouette_scores, marker='o')
    plt.title('Silhouette Scores for Different Numbers of Clusters')
    plt.xlabel('Number of clusters')
    plt.ylabel('Silhouette Score')
    plt.grid(True)
    plt.show()

# การจัดกลุ่มด้วย GMM
def gmm_clustering(X, n_clusters):
    gmm = GaussianMixture(n_components=n_clusters, random_state=42)
    gmm_labels = gmm.fit_predict(X)
    return gmm_labels

# เรียกใช้ฟังก์ชันเพื่อวิเคราะห์จำนวนกลุ่มที่เหมาะสม
plot_elbow(X, max_clusters=200)
plot_silhouette_scores(X, max_clusters=200)

# การจัดกลุ่มด้วย KMeans
n_clusters_kmeans = 3  # ใช้จำนวนกลุ่มที่เหมาะสมจาก Elbow Method
kmeans = KMeans(n_clusters=n_clusters_kmeans, init='k-means++', random_state=42, max_iter=300, n_init=10)
kmeans_labels = kmeans.fit_predict(X)

# การจัดกลุ่มด้วย GMM
n_clusters_gmm = 3  # ใช้จำนวนกลุ่มที่เหมาะสมจาก Elbow Method
gmm_labels = gmm_clustering(X, n_clusters=n_clusters_gmm)

# การประเมินผลลัพธ์
print("Silhouette Score for KMeans:", silhouette_score(X, kmeans_labels))
print("Silhouette Score for GMM:", silhouette_score(X, gmm_labels))