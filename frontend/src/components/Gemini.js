// Gemini.js
import React from 'react';

const Gemini = () => {
  return (
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
  );
};

export default Gemini;
