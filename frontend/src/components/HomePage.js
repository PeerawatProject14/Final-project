import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import Gemini from './Gemini'; 
import Search from './Search'; 
import LoginPage from './LoginPage';

function HomePage() {
  const [isGemini, setIsGemini] = useState(false); 
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [fadeIn, setFadeIn] = useState(false); 
  const [serverStatus, setServerStatus] = useState('Loading...'); 
  const [researchData, setResearchData] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(''); 
  const [userId, setUserId] = useState(null); // ประกาศ userId ที่นี่
  const [bookmarks, setBookmarks] = useState([]); 
  const navigate = useNavigate(); 

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
        console.log("Received data:", data);
        setResearchData(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching data:', error));

    // ตรวจสอบว่าเข้าสู่ระบบหรือไม่
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); 
    const id = localStorage.getItem('userId'); // ดึง userId จาก localStorage
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserId(id); // ตั้งค่า userId ที่นี่
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId'); // ลบ userId ด้วย
    setIsLoggedIn(false);
    setUserEmail('');
    setUserId(null); // ตั้งค่า userId เป็น null
    navigate('/login'); 
  };

  const handleGeminiClick = () => {
    if (!isGemini) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsGemini(true);
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleBookmark = async (researchId) => {
    const userId = localStorage.getItem('userId'); // ดึง userId จาก localStorage
    console.log('Checking if bookmark exists:', { research_id: researchId, user_id: userId });

    // ตรวจสอบว่ามี bookmark นี้อยู่แล้วหรือไม่
    const checkResponse = await fetch(`http://localhost:5000/bookmarks/check?research_id=${researchId}&user_id=${userId}`);
    const checkData = await checkResponse.json();

    if (checkData.exists) {
        alert('Bookmark already exists.');
        return; // ออกไปถ้ามีอยู่แล้ว
    }

    console.log('Sending bookmark:', { research_id: researchId, user_id: userId });

    try {
        const response = await fetch('http://localhost:5000/bookmarks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ research_id: researchId, user_id: userId }),
        });

        const data = await response.json();
        console.log('Response from server:', data);
    } catch (error) {
        console.error('Error adding bookmark:', error);
    }
};

  

  const handleBookmarkClick = () => {
    navigate('/bookmark'); 
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
    return '';
  };

  return (
    <div className={`d-flex flex-column min-vh-100 ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <header className="header d-flex justify-content-between align-items-center py-3 border-bottom">
        <h1 className="logo mb-0">TH-RESEARCH</h1>
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <button onClick={handleBookmarkClick} className="btn btn-link">
                BOOKMARK
              </button>
            </li>
            <li className="nav-item">
              <button onClick={handleGeminiClick} className="btn btn-link">
                GEMINI
              </button>
            </li>
            <li className="nav-item">
              <button onClick={handleSearchClick} className="btn btn-link">
                ค้นหา
              </button>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text">Logged in as: {userEmail} (User ID: {userId})</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-primary">
                  เข้าสู่ระบบ
                </Link>
              </li>
            )}
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
            <Search 
              researchData={researchData} 
              truncateText={truncateText} 
              handleBookmark={handleBookmark} 
              bookmarks={bookmarks} 
            />
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
