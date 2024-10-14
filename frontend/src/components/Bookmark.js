import React, { useState, useEffect } from 'react';
import './Bookmark.css';

function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // ฟังก์ชันสำหรับดึงข้อมูล bookmark จาก API
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // ดึง userId จาก localStorage

    if (userId) {
      // ทำการเรียก API เพื่อดึงข้อมูล bookmarks
      fetch(`http://localhost:5000/bookmarks/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(async (data) => {
          console.log("Fetched bookmarks:", data); // เพิ่มการตรวจสอบข้อมูล
          const bookmarksWithResearch = await Promise.all(data.map(async (bookmark) => {
            // ดึงข้อมูล research สำหรับแต่ละ bookmark
            const researchResponse = await fetch(`http://localhost:5000/research/${bookmark.research_id}`);
            const researchData = await researchResponse.json();
            return { ...bookmark, research: researchData }; // เพิ่มข้อมูล research เข้าไปใน bookmark
          }));
          setBookmarks(bookmarksWithResearch);
        })
        .catch((error) => {
          console.error('Error fetching bookmarks:', error);
          setErrorMessage('ไม่สามารถดึงข้อมูลบันทึกได้');
        });
    } else {
      setErrorMessage('ไม่พบ user ID');
    }
  }, []);

  return (
    <div className="bookmark-container">
      <h2 className="text-center">บันทึกของฉัน</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {bookmarks.length === 0 ? (
        <p className="text-center">ยังไม่มีข้อมูลที่บันทึกไว้</p>
      ) : (
        <ul className="bookmark-list">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="bookmark-item">
              <div className="bookmark-content">
                <h4>{bookmark.title}</h4>
                <p>{bookmark.description}</p>
                {/* แสดงข้อมูลของ research ที่เกี่ยวข้อง */}
                {bookmark.research && (
                  <div>
                    <h5>ข้อมูลการวิจัย:</h5>
                    <p>ชื่อ: {bookmark.research.ชื่อเรื่อง}</p>
                    <p>รายละเอียด: {bookmark.research.คำอธิบาย}</p>
                  </div>
                )}
              </div>
              {/* ลบปุ่มลบออก */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookmarkPage;
