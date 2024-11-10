import React from 'react';
import './Search.css';  // นำเข้าไฟล์ CSS

function UserResearch(){
  return (
    <div className="search-container">
      <h2 className="search-title">ค้นหางานวิจัย</h2>
      <p className="search-subtitle">ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
      <div className="input-group search-input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder="ใส่คำค้นหาของคุณที่นี่..."
        />
        <button className="btn btn-primary search-button">ค้นหา</button>
      </div>
    </div>
  );
};

export default UserResearch;
