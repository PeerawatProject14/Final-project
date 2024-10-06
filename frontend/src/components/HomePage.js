import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // นำเข้าไฟล์ CSS

function HomePage() {
  const [isGemini, setIsGemini] = useState(false); // State สำหรับจัดการการแสดงเนื้อหา GEMINI
  const [isTransitioning, setIsTransitioning] = useState(false); // State สำหรับจัดการการเปลี่ยนหน้า
  const [fadeIn, setFadeIn] = useState(false); // State สำหรับจัดการ fade-in
  const [serverStatus, setServerStatus] = useState('Loading...'); // State สำหรับสถานะเซิร์ฟเวอร์

  useEffect(() => {
    setFadeIn(true); // เริ่มต้น fade-in เมื่อโหลดหน้า

    // ดึงข้อมูลสถานะเซิร์ฟเวอร์
    fetch('http://localhost:5000/status')
      .then((response) => response.json())
      .then((data) => setServerStatus(data.status))
      .catch((error) => setServerStatus('Unable to fetch server status'));
  }, []);

  const handleGeminiClick = () => {
    if (!isGemini) {
      setIsTransitioning(true); // เริ่มการเปลี่ยนหน้า
      setTimeout(() => {
        setIsGemini(true); // เปลี่ยน state เมื่อกดปุ่ม GEMINI
        setIsTransitioning(false); // จบการเปลี่ยนหน้า
      }, 500); // รอเวลาที่ CSS transition ทำงาน
    }
  };

  const handleSearchClick = () => {
    if (isGemini) {
      setIsTransitioning(true); // เริ่มการเปลี่ยนหน้า
      setTimeout(() => {
        setIsGemini(false); // เปลี่ยน state เมื่อกดปุ่มค้นหา
        setIsTransitioning(false); // จบการเปลี่ยนหน้า
      }, 500); // รอเวลาที่ CSS transition ทำงาน
    }
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <header className="header d-flex justify-content-between align-items-center py-3 border-bottom">
        <h1 className="logo mb-0">TH-RESEARCH</h1>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <button onClick={handleGeminiClick} className="btn btn-link">
                GEMINI
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link">BOOKMARK</button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link">หมวดหมู่</button>
            </li>
            <li className="nav-item">
              <button onClick={handleSearchClick} className="btn btn-link">
                ค้นหา
              </button>
            </li>
            <li className="nav-item">
              <Link to="/login" className="btn btn-primary">
                เข้าสู่ระบบ
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="home-background d-flex justify-content-center align-items-center flex-grow-1 text-center position-relative">
        <div
          className={`search-section ${isTransitioning ? 'fade-out' : 'fade-in'}`}
          style={{
            maxWidth: '100%', // ปรับให้เป็น 100% แทน 1000px
            width: '70%', // ปรับให้เป็น 100%
            position: 'absolute',
            left: '50%', // ตั้งค่าให้แน่นอน
            transform: 'translateX(-50%)', // เพื่อให้ตรงกลาง
            opacity: isGemini ? (isTransitioning ? 0 : 1) : (isTransitioning ? 0 : 1),
          }}
        >
          {isGemini ? ( // แสดงหน้า GEMINI
            <>
              <h2 style={{ fontSize: '2rem' }}>GEMINI</h2>
              <p style={{ fontSize: '1.25rem' }}>กรุณาใส่ข้อมูลการสรุปงานวิจัยของคุณด้านล่างนี้</p>
              <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
                <input type="text" className="form-control" placeholder="ใส่รายละเอียดของงานวิจัยที่นี่..." />
                <button className="btn btn-primary">อัพโหลดไฟล์</button>
              </div>
              <div className="box-list-section">
                <div className="d-flex justify-content-center">
                  <div className="box me-2">ตัวเลือก 1</div>
                  <div className="box">ตัวเลือก 2</div>
                </div>
              </div>
            </>
          ) : ( // แสดงหน้าค้นหา
            <>
              <h2 style={{ fontSize: '2rem' }}>ค้นหางานวิจัย</h2>
              <p style={{ fontSize: '1.25rem' }}>ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
              <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
                <input type="text" className="form-control" placeholder="ใสงานวิจัยของคุณที่นี่..." />
                <button className="btn btn-primary">ค้นหา</button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="footer d-flex justify-content-between align-items-center py-3 border-top mt-auto">
        <div>
          <p>© 2566 บริษัทของคุณ</p>
        </div>
        <div className="server-status pe-3" style={{ textAlign: 'right' }}>
          <p>Server Status: {serverStatus}</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
