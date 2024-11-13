import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResearchData.css';

const UserResearchDetail = () => {
  const { research_id } = useParams();  // ดึง research_id จาก URL
  const navigate = useNavigate();  // สำหรับการนำทางกลับไปหน้าก่อนหน้า
  const [research, setResearch] = useState(null);  // เก็บข้อมูลที่ต้องการแสดง
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleBackClick = () => {
    navigate(-1);  // กลับไปหน้าก่อนหน้า
  };

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/research/${research_id}`);
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลได้');
        }
        const data = await response.json();
        setResearch(data);  // ตั้งค่า state research เพื่อแสดงข้อมูล
        console.log(data);  // ตรวจสอบข้อมูลที่ได้จาก API
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
        <p><strong>อ้างอิง URL:</strong> {research.url}</p>
        <p><strong>description:</strong> {research.description}</p>
        <p><strong>keyword:</strong> {research.keyword}</p>
      </div>
    </main>
  );
};

export default UserResearchDetail;
