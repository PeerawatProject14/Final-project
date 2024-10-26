import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = ({ researchData, truncateText, handleBookmark, bookmarks }) => {
  const [searchQuery, setSearchQuery] = useState(''); // เก็บค่าการค้นหา
  const [filteredData, setFilteredData] = useState([]); // เริ่มต้นเป็น array ว่าง

  // ฟังก์ชันค้นหาข้อมูล
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredData([]); // ถ้าคำค้นหาว่าง ไม่ต้องแสดงข้อมูลใดๆ
    } else {
      const filtered = researchData.filter((research) =>
        research.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        research.researcher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        research.keyword.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // ค้นหาข้อมูลเมื่อกด Enter
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
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress} // ฟังก์ชันสำหรับการกดปุ่ม Enter
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
                <div key={research.id} style={{ width: '80%' }}>
                  <Link
                    to={`/research/${research.id}`} // เปลี่ยนให้ไปที่ research ID แทน
                    state={{ research }}// ส่งข้อมูล research ไปยังหน้าถัดไป
                    style={{
                      display: 'block',
                      minHeight: '100px',
                      maxHeight: '300px',
                      overflow: 'hidden',
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      padding: '40px',
                      backgroundColor: '#fff',
                      transition: 'max-height 0.3s ease',
                    }}
                  >
                    <h4>{truncateText(research.name)}</h4>
                    <p><strong>researcher:</strong> {truncateText(research.researcher)}</p>
                    <p><strong>keyword:</strong> {truncateText(research.keyword)}</p>
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // หยุดการทำงานเมื่อคลิกปุ่ม
                      handleBookmark(research.id);
                    }} 
                    className={`btn ${bookmarks.includes(research.id) ? 'btn-warning' : 'btn-outline-warning'} mt-2`}
                  >
                    {bookmarks.includes(research.id) ? 'ยกเลิกบุ๊คมาร์ค' : 'บุ๊คมาร์ค'}
                  </button>
                </div>
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
