import React from 'react';
import { Link } from 'react-router-dom';

const Search = ({ researchData, truncateText }) => {
  return (
    <>
      <h2 style={{ fontSize: '2rem' }}>ค้นหางานวิจัย</h2>
      <p style={{ fontSize: '1.25rem' }}>ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
      <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
        <input type="text" className="form-control" placeholder="ใสงานวิจัยของคุณที่นี่..." />
        <button className="btn btn-primary">ค้นหา</button>
      </div>
      <h3>ข้อมูลการวิจัย</h3>
      <div style={{ maxHeight: '550px', overflowY: 'auto' }} className="mb-7">
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          {researchData.map((research) => (
            <Link
              to="/research"
              state={{ research }} // ส่งข้อมูล research ไปยังหน้าถัดไป
              key={research.id}
              style={{ width: '80%' }}
            >
              <div
                style={{
                  height: '80%',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  padding: '40px',
                  backgroundColor: '#fff',
                }}
              >
                <h4>{truncateText(research.ชื่อเรื่อง)}</h4>
                <p><strong>ชื่อนักวิจัย:</strong> {truncateText(research.ชื่อนักวิจัย)}</p>
                <p><strong>คำสำคัญ:</strong> {truncateText(research.คำสำคัญ)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;
