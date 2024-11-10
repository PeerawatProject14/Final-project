// ในไฟล์ HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import Search from './Search'; 
import LoginPage from './LoginPage';
import UserResearch from './UserResearch';

function HomePage() {
  const [isUserResearch, setIsUserResearch] = useState(false); // ประกาศตัวแปรที่นี่
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [fadeIn, setFadeIn] = useState(false); 
  const [serverStatus, setServerStatus] = useState('Loading...'); 
  const [researchData, setResearchData] = useState([]); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(''); 
  const [userId, setUserId] = useState(null); 
  const [bookmarks, setBookmarks] = useState([]); 
  const navigate = useNavigate(); 

  useEffect(() => {
    setFadeIn(true);
    fetch('http://localhost:5000/status')
      .then((response) => response.json())
      .then((data) => setServerStatus(data.status))
      .catch((error) => setServerStatus('Unable to fetch server status'));

    fetch('http://localhost:5000/research')
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data:", data);
        setResearchData(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error('Error fetching data:', error));

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email'); 
    const id = localStorage.getItem('userId');
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserId(id);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserId(null);
    navigate('/login'); 
  };

  const handleBookmark = async (researchId) => {
    const userId = localStorage.getItem('userId');
    console.log('Checking if bookmark exists:', { research_id: researchId, user_id: userId });

    const checkResponse = await fetch(`http://localhost:5000/bookmarks/check?research_id=${researchId}&user_id=${userId}`);
    const checkData = await checkResponse.json();

    if (checkData.exists) {
      alert('Bookmark already exists.');
      return;
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

  const handleUserResearchClick = () => {
    if (!isUserResearch) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsUserResearch(true); // ใช้ setIsUserResearch โดยไม่ประกาศใหม่
        setIsTransitioning(false);
      }, 500);
    }
  };

  const handleSearchClick = () => {
    if (isUserResearch) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsUserResearch(false); // ใช้ setIsUserResearch โดยไม่ประกาศใหม่
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
              <button onClick={handleUserResearchClick} className="btn btn-link">
                ค้นหาจากงานวิจัยขิงคุณ
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
            opacity: isUserResearch ? (isTransitioning ? 0 : 1) : (isTransitioning ? 0 : 1),
          }}
        >
          {isUserResearch ? (
            <UserResearch />
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
