import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResearchData.css'; // ไฟล์ CSS หากต้องการใช้ร่วมกับ CSS

const ResearchData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { research } = location.state || {}; // ดึงข้อมูลจาก state

  if (!research) {
    return <p>ไม่พบข้อมูล</p>;
  }

  const handleBackClick = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า
  };

  return (
    <main className="research-data-container">
      <button onClick={handleBackClick} className="btn btn-secondary mb-3">กลับ</button>
      
      <div className="research-detail-card">
        <h2 className="research-title">{research.ชื่อเรื่อง}</h2>
        <p><strong>ชื่อนักวิจัย:</strong> {research.ชื่อนักวิจัย}</p>
        <p><strong>ชื่อนักวิจัยร่วม:</strong> {research.ชื่อนักวิจัยร่วม}</p>
        <p><strong>หน่วยงาน:</strong> {research.หน่วยงาน}</p>
        <p><strong>ปีที่เผยแพร่:</strong> {research.ปีที่เผยแพร่}</p>
        <p><strong>อ้างอิง URL:</strong> <a href={research.URL} target="_blank" rel="noopener noreferrer">{research.URL}</a></p>
        <p><strong>คำอธิบาย:</strong> {research.คำอธิบาย}</p>
        <p><strong>คำสำคัญ:</strong> {research.คำสำคัญ}</p>
      </div>
    </main>
  );
};

export default ResearchData;
