import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResearchData.css';

const ResearchData = () => {
  const {research_id} = useParams();
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
        qwe: research.qwe,
        name: research.name,
        abc: research.abc,
        PredictedLabel: research.PredictedLabel
      };
      setStoredResearch(researchData);

      // ส่งข้อมูลไปยัง Express API เพื่อประมวลผลใน Python script
      fetch('http://localhost:5000/api/process-research', {  // ใช้ /api/process-research
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
        <p><strong>เลขรหัสดีโอไอ:</strong> {research.เลขรหัสดีโอไอ}</p>
        <p><strong>qwe:</strong> {research.qwe}</p>
        <p><strong>ชื่อนักวิจัยร่วม:</strong> {research.ชื่อนักวิจัยร่วม}</p>
        <p><strong>หน่วยงาน:</strong> {research.หน่วยงาน}</p>
        <p><strong>ปีที่เผยแพร่:</strong> {research.ปีที่เผยแพร่}</p>
        <p><strong>อ้างอิง URL:</strong> <a href={research.URL} target="_blank" rel="noopener noreferrer">{research.URL}</a></p>
        <p><strong>abc:</strong> {research.abc}</p>
        <p><strong>คำสำคัญ:</strong> {research.คำสำคัญ}</p>

        <div className="center-button">
          <button onClick={handleSaveData} className="btn btn-primary mb-3">ค้นหางานวิจัยที่คล้ายกัน</button>
        </div>
        
        {/* แสดงผลลัพธ์จาก Python */}
        {similarResearch && (
          <div className="similar-research-info">
            <h3>ผลลัพธ์จากการค้นหางานวิจัยที่คล้ายกัน</h3>
            <p><strong>qwe:</strong> {similarResearch.qwe}</p>
            <p><strong>abc:</strong> {similarResearch.abc}</p>
            <p><strong>Predicted Label:</strong> {similarResearch.PredictedLabel}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResearchData;
