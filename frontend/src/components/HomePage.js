import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './App.css';
import Gemini from './Gemini'; 
import Search from './Search'; 

function HomePage() {
  const [isGemini, setIsGemini] = useState(false); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [fadeIn, setFadeIn] = useState(false); 
  const [serverStatus, setServerStatus] = useState('Loading...'); 
  const [researchData, setResearchData] = useState([]); // State สำหรับข้อมูลการวิจัย
  const navigate = useNavigate(); // เพิ่ม useNavigate สำหรับการเปลี่ยนเส้นทาง

  useEffect(() => {
    setFadeIn(true);

    // ดึงข้อมูลสถานะเซิร์ฟเวอร์
    fetch('http://localhost:5000/status')
      .then((response) => response.json())
      .then((data) => setServerStatus(data.status))
      .catch((error) => setServerStatus('Unable to fetch server status'));

    // ดึงข้อมูลจากฐานข้อมูล
    fetch('http://localhost:5000/research')
    .then((response) => response.json())
    .then((data) => {
      console.log("Received data:", data); // ตรวจสอบโครงสร้างข้อมูลที่ได้
      setResearchData(Array.isArray(data) ? data : []); // ตรวจสอบว่า data เป็น array หรือไม่
    })
    .catch((error) => console.error('Error fetching data:', error));  
  }, []);

  const handleGeminiClick = () => {
    if (!isGemini) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsGemini(true);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleBookmarkClick = () => {
    navigate('/bookmark'); // เปลี่ยนเส้นทางไปยังหน้า Bookmark
  };

  const handleSearchClick = () => {
    if (isGemini) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsGemini(false);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const truncateText = (text) => {
    if (text && typeof text === 'string') {
        return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    return ''; // Return an empty string if text is undefined or not a string
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
              <button onClick={handleBookmarkClick} className="btn btn-link">
                BOOKMARK
              </button>
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
            opacity: isGemini ? (isTransitioning ? 0 : 1) : (isTransitioning ? 0 : 1),
          }}
        >
          {isGemini ? (
            <Gemini />
          ) : (
            <Search researchData={researchData} truncateText={truncateText} />
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
