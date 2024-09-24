import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // import CSS file for styling

function HomePage() {
  return (
    <div className="landing-container">
      <header className="header">
        <div className="logo">
          <h1>TH-RESEARCH</h1>
        </div>
        <nav className="nav">
          <ul>
            <li>GEMINI</li>
            <li>BOOKMARK</li>
            <li>หมวดหมู่</li>
            <li>ค้นหา</li>
            <li>
              <Link to="/login">
                <button className="login-button">เข้าสู่ระบบ</button>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <div className="search-section">
          <h2>ค้นหางานวิจัย</h2>
          <p>ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
          <div className="search-bar">
            <input type="text" placeholder="ใส่งานวิจัยของคุณที่นี่..." />
            <button className="search-button">ค้นหา</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>©2023 Yourcompany</p>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    </div>
  );
}

export default HomePage;
