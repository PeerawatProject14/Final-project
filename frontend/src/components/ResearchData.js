import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResearchData.css'; // ไฟล์ CSS หากต้องการใช้ร่วมกับ CSS

const ResearchData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { research } = location.state || {}; // ดึงข้อมูลจาก state

  const [storedResearch, setStoredResearch] = useState(null); // เก็บข้อมูลที่ต้องการ

  const handleBackClick = () => {
    navigate(-1); // กลับไปหน้าก่อนหน้า
  };

  // ฟังก์ชันสำหรับเก็บข้อมูลเมื่อผู้ใช้กดปุ่ม
  const handleSaveData = () => {
    if (research) {
      setStoredResearch({
        ชื่อเรื่อง: research.ชื่อเรื่อง,
        คำอธิบาย: research.คำอธิบาย,
        PredictedLabel: research.PredictedLabel
      });
    }
  };

  if (!research) {
    return <p>ไม่พบข้อมูล</p>;
  }

  return (
    <main className="research-data-container">
      
      
      

      <div className="research-detail-card">
        <button onClick={handleBackClick} className="btn btn-secondary mb-3">กลับ</button>
        <h2 className="research-title">{research.ชื่อเรื่อง}</h2>
        <p><strong>เลขรหัสดีโอไอ:</strong> {research.เลขรหัสดีโอไอ}</p>
        <p><strong>ชื่อนักวิจัย:</strong> {research.ชื่อนักวิจัย}</p>
        <p><strong>ชื่อนักวิจัยร่วม:</strong> {research.ชื่อนักวิจัยร่วม}</p>
        <p><strong>หน่วยงาน:</strong> {research.หน่วยงาน}</p>
        <p><strong>ปีที่เผยแพร่:</strong> {research.ปีที่เผยแพร่}</p>
        <p><strong>อ้างอิง URL:</strong> <a href={research.URL} target="_blank" rel="noopener noreferrer">{research.URL}</a></p>
        <p><strong>คำอธิบาย:</strong> {research.คำอธิบาย}</p>
        <p><strong>คำสำคัญ:</strong> {research.คำสำคัญ}</p>
      
        <div className="center-button">
          <button onClick={handleSaveData} className="btn btn-primary mb-3">เก็บข้อมูล</button>
        </div>
        {/* แสดงข้อมูลที่เก็บไว้ใน state */}
        {storedResearch && (
          <div className="stored-research-info">
            <h3>ข้อมูลที่ส่งให้ Python(เพื่อไปทำ cosine simฯ กับกลุ่มเดียวกับที่ส่งค่าไป)</h3>
            <p><strong>ชื่อเรื่อง:</strong> {storedResearch.ชื่อเรื่อง}</p>
            <p><strong>คำอธิบาย:</strong> {storedResearch.คำอธิบาย}</p>
            <p><strong>PredictedLabel:</strong> {storedResearch.PredictedLabel}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResearchData;
