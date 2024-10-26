import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResearchData.css';

const ResearchData = () => {
  const { research_id } = useParams();
  const navigate = useNavigate();
  const [research, setResearch] = useState(null); // เก็บข้อมูลที่ต้องการ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storedResearch, setStoredResearch] = useState(null);
  const [similarResearch, setSimilarResearch] = useState(null); // เก็บผลลัพธ์ที่ได้จาก Python script

  const handleBackClick = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า
  };

  // ฟังก์ชันสำหรับเก็บข้อมูลเมื่อผู้ใช้กดปุ่ม
  const handleSaveData = () => {
    if (research) {
      const researchData = {
        id: research.id,
        name: research.name,
        description: research.description,
        PredictedLabel: research.PredictedLabel
      };
      setStoredResearch(researchData);

      // ส่งข้อมูลไปยัง Express API เพื่อประมวลผลใน Python script
      fetch('http://localhost:5000/api/process-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(researchData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // กำหนดค่า similarResearch ตามข้อมูลที่ได้จาก Python script
          setSimilarResearch(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/research/${research_id}`);
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลได้');
        }
        const data = await response.json();
        setResearch(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, [research_id]);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!research) {
    return <p>ไม่พบข้อมูล</p>;
  }

  return (
    <main className="research-data-container">
      <div className="research-detail-card">
        <button onClick={handleBackClick} className="btn btn-secondary mb-3">กลับ</button>
        <h2 className="research-title">{research.name}</h2>
        <p><strong>id:</strong> {research.id}</p>
        <p><strong>doi:</strong> {research.doi}</p>
        <p><strong>name:</strong> {research.name}</p>
        <p><strong>co_researcher:</strong> {research.co_researcher}</p>
        <p><strong>institution:</strong> {research.institution}</p>
        <p><strong>year:</strong> {research.year}</p>
        <p><strong>อ้างอิง URL:</strong> <a href={research.url} target="_blank" rel="noopener noreferrer">{research.url}</a></p>
        <p><strong>description:</strong> {research.description}</p>
        <p><strong>keyword:</strong> {research.keyword}</p>

        <div className="center-button">
          <button onClick={handleSaveData} className="btn btn-primary mb-3">ค้นหางานวิจัยที่คล้ายกัน</button>
        </div>

        {/* แสดงการ์ดวิจัยที่คล้ายกัน */}
        {similarResearch && similarResearch.matching_research && (
          <div className="similar-research-container">
            {similarResearch.matching_research.map((item) => (
              <div className="research-card" key={item.id}>
                <h4>{item.name}</h4>
                <p><strong>id:</strong> {item.id}</p>
                <p><strong>description:</strong> {item.description}</p>
                <p><strong>PredictedLabel:</strong> {item.PredictedLabel}</p>
                {/* คุณสามารถเพิ่มข้อมูลอื่น ๆ ที่ต้องการแสดงที่นี่ */}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ResearchData;
