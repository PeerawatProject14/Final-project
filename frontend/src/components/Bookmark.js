import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; 
import './Bookmark.css';

function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [apiSummaries, setApiSummaries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('bookmark');

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (userId) {
      setLoading(true); 
      // ดึงข้อมูล bookmark จาก API
      fetch(`http://localhost:5000/bookmarks/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(async (data) => {
          console.log("Fetched bookmarks:", data);
          const bookmarksWithResearch = await Promise.all(data.map(async (bookmark) => {
            const researchResponse = await fetch(`http://localhost:5000/research/${bookmark.research_id}`);
            const researchData = await researchResponse.json();
            return { ...bookmark, research: researchData };
          }));
          setBookmarks(bookmarksWithResearch);
        })
        .catch((error) => {
          console.error('Error fetching bookmarks:', error);
          setErrorMessage('ไม่สามารถดึงข้อมูลบันทึกได้');
        });

      // เรียก API เพื่อดึงข้อมูลสรุปจาก Gemini ที่บันทึกไว้ในฐานข้อมูล
      fetch(`http://localhost:5000/summaries/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setApiSummaries(data);
        })
        .catch((error) => {
          console.error('Error fetching API summaries:', error);
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {
      setErrorMessage('ไม่พบ user ID');
      setLoading(false);
    }
  }, []);

  return (
    <div className="bookmark-container">
      <h2 className="text-center">บันทึกของฉัน</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {loading && <p className="text-center">กำลังโหลดข้อมูล...</p>} 

      <div className="view-toggle text-center">
        <button 
          className={`btn ${viewType === 'bookmark' ? 'btn-primary' : 'btn-outline-primary'}`} 
          onClick={() => setViewType('bookmark')}
        >
          ดู Bookmark
        </button>
        <button 
          className={`btn ${viewType === 'api' ? 'btn-primary' : 'btn-outline-primary'}`} 
          onClick={() => setViewType('api')}
        >
          ดูผลลัพธ์จาก API
        </button>
      </div>

      {viewType === 'bookmark' ? (
        <ul className="bookmark-list">
          {bookmarks.length === 0 ? (
            <p className="text-center">ยังไม่มีข้อมูลที่บันทึกไว้</p>
          ) : (
            bookmarks.map((bookmark) => (
              <li key={bookmark.id} className="bookmark-item">
                <div className="bookmark-content">
                  {bookmark.research && (
                    <div>
                      <h5>{bookmark.research.name}</h5>
                      <p>รายละเอียด: {bookmark.research.description}</p>
                      {/* ปุ่มไปหน้างานวิจัย */}
                      <a href={`/research/${bookmark.research_id}`} className="btn btn-link">
                        ไปหน้างานวิจัย
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      ) : (
        <ul className="bookmark-list">
          {apiSummaries.length === 0 ? (
            <p className="text-center">ยังไม่มีผลลัพธ์จาก API ที่บันทึกไว้</p>
          ) : (
            apiSummaries.map((summary) => (
              <li key={summary.id} className="bookmark-item">
                <div className="bookmark-content">
                  <h4>ผลลัพธ์จากการสรุป</h4>
                  <ReactMarkdown>{summary.summary}</ReactMarkdown>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default BookmarkPage;