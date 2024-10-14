import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = ({ researchData, truncateText }) => {
  const [searchQuery, setSearchQuery] = useState(''); // เก็บค่าการค้นหา
  const [filteredData, setFilteredData] = useState([]); // เริ่มต้นเป็น array ว่าง

  // ฟังก์ชันค้นหาข้อมูล
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredData([]); // ถ้าคำค้นหาว่าง ไม่ต้องแสดงข้อมูลใดๆ
    } else {
      const filtered = researchData.filter((research) =>
        research.ชื่อเรื่อง.toLowerCase().includes(searchQuery.toLowerCase()) ||
        research.ชื่อนักวิจัย.toLowerCase().includes(searchQuery.toLowerCase()) ||
        research.คำสำคัญ.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  return (
    <>
      <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>ค้นหางานวิจัย</h2>
      <p style={{ fontSize: '1.25rem', textAlign: 'center' }}>ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
      <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="ใสงานวิจัยของคุณที่นี่..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // อัปเดตค่าการค้นหา
        />
        <button className="btn btn-primary" onClick={handleSearch}>ค้นหา</button>
      </div>
      
      {/* แสดงผลเฉพาะเมื่อมีการค้นหา */}
      {filteredData.length > 0 && (
        <>
          <h3>ข้อมูลการวิจัย</h3>
          <div style={{ maxHeight: '550px', overflowY: 'auto' }} className="mb-7">
            <div className="d-flex flex-column justify-content-center align-items-center gap-3">
              {filteredData.map((research) => (
                <Link
                  to="/research"
                  state={{ research }} // ส่งข้อมูล research ไปยังหน้าถัดไป
                  key={research.id}
                  style={{ width: '80%' }}
                >
                  <div
                    style={{
                      minHeight: '100px', // ความสูงขั้นต่ำสำหรับกล่อง
                      maxHeight: '300px', // ความสูงสูงสุดสำหรับกล่อง
                      overflow: 'hidden', // ซ่อนข้อความส่วนเกิน
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      padding: '40px',
                      backgroundColor: '#fff',
                      transition: 'max-height 0.3s ease', // เพิ่มการเปลี่ยนแปลงความสูงอย่างนุ่มนวล
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
      )}

      {/* แสดงข้อความเมื่อไม่พบข้อมูลที่ตรงกับการค้นหา */}
      {filteredData.length === 0 && searchQuery !== '' && (
        <p>ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
      )}
    </>
  );
};

export default Search;
