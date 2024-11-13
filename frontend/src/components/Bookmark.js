import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; 
import { useNavigate } from 'react-router-dom';
import './Bookmark.css';

function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [apiSummaries, setApiSummaries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('bookmark');
  const [selectedItems, setSelectedItems] = useState([]); // เก็บไอเท็มที่เลือก
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับคลิกไปยังหน้ารายละเอียดงานวิจัย
  const handleCardClick = (researchId) => {
    navigate(`/research/${researchId}`); // ใช้ navigate แทน window.location.href
  };

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

  // ฟังก์ชันสำหรับเลือกไอเท็มเพื่อเปรียบเทียบ
  const handleSelect = (bookmark) => {
    if (selectedItems.includes(bookmark)) {
      setSelectedItems(selectedItems.filter(item => item !== bookmark));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, bookmark]);
    }
  };

  // ฟังก์ชันสำหรับเปรียบเทียบไอเท็มที่เลือก
  const handleCompare = () => {
    if (selectedItems.length !== 2) {
      alert('กรุณาเลือกงานวิจัย 2 ชิ้นเพื่อทำการเปรียบเทียบ');
      return;
    }

    navigate('/compare', {
      state: {
        description1: selectedItems[0].research.description,
        description2: selectedItems[1].research.description,
      },
    });
  };

  return (
    <div className="bookmark-page">
  <button className="back-btn" onClick={() => window.history.back()}>
    กลับ
  </button>
  <div className="bookmark-content">
    <h2 className="text-center">บันทึกของฉัน</h2> {/* หัวข้อจะไม่เปลี่ยนแปลงตาม viewType */}

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

    {/* แสดงผลตาม viewType */}
    {viewType === 'bookmark' ? (
      <div className="bookmark-list">
        {bookmarks.length === 0 ? (
          <p className="text-center">ยังไม่มีข้อมูลที่บันทึกไว้</p>
        ) : (
          [...new Set(bookmarks.map(b => b.research_id))].map((uniqueId) => {
            const bookmark = bookmarks.find(b => b.research_id === uniqueId); // ค้นหา bookmark ที่ไม่ซ้ำ
        
            return (
              <div key={bookmark.id} className="bookmark-item" onClick={() => handleCardClick(bookmark.research_id)}>
                <div className="bookmark-content">
                  {bookmark.research && (
                    <div>
                      <h4>{bookmark.research.name}</h4>
                      <p>คำอธิบาย: {bookmark.research.description}</p>
                      <p>วันที่บันทึก: {new Date(bookmark.created_at).toLocaleString('th-TH')}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelect(bookmark); }}
                        className={`btn ${selectedItems.includes(bookmark) ? 'btn-selected' : 'btn-outline-secondary'}`}
                      >
                        {selectedItems.includes(bookmark) ? 'ยกเลิกเลือก' : 'เลือกเปรียบเทียบ'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
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
                <p>วันที่บันทึก: {new Date(summary.created_at).toLocaleString('th-TH')}</p> {/* แสดงวันที่จาก created_at */}
              </div>
            </li>
          ))
        )}
      </ul>
    )}

    {/* ปุ่มเปรียบเทียบ */}
    {viewType === 'bookmark' && (
      <div className="compare-button-container">
        <button
          className="btn btn-primary compare-button"
          onClick={handleCompare}
          disabled={selectedItems.length !== 2}
        >
          เปรียบเทียบงานวิจัย
        </button>
      </div>
    )}

  </div>
</div>

  );
}

export default BookmarkPage;