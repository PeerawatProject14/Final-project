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
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const handleCardClick = (researchId) => {
    navigate(`/research/${researchId}`);
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetch(`http://localhost:5000/bookmarks/${userId}`)
        .then((response) => response.json())
        .then(async (data) => {
          const bookmarksWithResearch = await Promise.all(data.map(async (bookmark) => {
            const researchResponse = await fetch(`http://localhost:5000/research/${bookmark.research_id}`);
            const researchData = await researchResponse.json();
            return { ...bookmark, research: researchData };
          }));
          setBookmarks(bookmarksWithResearch);
        })
        .catch(() => setErrorMessage('ไม่สามารถดึงข้อมูลบันทึกได้'));

      fetch(`http://localhost:5000/summaries/${userId}`)
        .then((response) => response.json())
        .then(setApiSummaries)
        .catch(() => setErrorMessage('ไม่สามารถดึงข้อมูลสรุปจาก API ได้'))
        .finally(() => setLoading(false));
    } else {
      setErrorMessage('ไม่พบ user ID');
      setLoading(false);
    }
  }, [userId]);

  const handleSelect = (bookmark) => {
    if (selectedItems.includes(bookmark)) {
      setSelectedItems(selectedItems.filter(item => item !== bookmark));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, bookmark]);
    }
  };

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

  // ฟังก์ชันสำหรับลบ bookmark
  const handleDeleteBookmark = (bookmarkId) => {
    const confirmed = window.confirm("คุณแน่ใจว่าจะลบ Bookmark นี้หรือไม่?");
  
    if (confirmed) {
      // ถ้า user ยืนยันให้ลบ
      fetch(`http://localhost:5000/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete bookmark');
          }
          // อัพเดต UI หลังจากลบ
          setBookmarks((prevBookmarks) => 
            prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
          );
          alert('ลบสำเร็จ');
        })
        .catch((error) => {
          console.error('Error deleting bookmark:', error);
          alert('ไม่สามารถลบได้');
        });
    }
  };
  

  // ฟังก์ชันสำหรับลบ summary
  const handleDeleteSummary = (summaryId) => {
    const confirmed = window.confirm("คุณแน่ใจว่าจะลบผลลัพธ์นี้หรือไม่?");
  
    if (confirmed) {
      // ถ้า user ยืนยันให้ลบ
      fetch(`http://localhost:5000/summaries/${summaryId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete summary');
          }
          // อัพเดต UI หลังจากลบ
          setApiSummaries((prevSummaries) => 
            prevSummaries.filter((summary) => summary.id !== summaryId)
          );
          alert('ลบสำเร็จ');
        })
        .catch((error) => {
          console.error('Error deleting summary:', error);
          alert('ไม่สามารถลบได้');
        });
    }
  };
  

  return (
    <div className="bookmark-page">
      <button className="back-btn" onClick={() => window.history.back()}>
        กลับ
      </button>
      <div className="bookmark-content">
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
          <div className="bookmark-list">
            {bookmarks.length === 0 ? (
              <p className="text-center">ยังไม่มีข้อมูลที่บันทึกไว้</p>
            ) : (
              bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmark-item">
                  <div className="bookmark-content" onClick={() => handleCardClick(bookmark.research_id)}>
                    <h4>{bookmark.research?.name}</h4>
                    <p>คำอธิบาย: {bookmark.research?.description}</p>
                    <p>วันที่บันทึก: {new Date(bookmark.created_at).toLocaleString('th-TH')}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSelect(bookmark); }}
                      className={`btn ${selectedItems.includes(bookmark) ? 'btn-selected' : 'btn-outline-secondary'}`}
                    >
                      {selectedItems.includes(bookmark) ? 'ยกเลิกเลือก' : 'เลือกเปรียบเทียบ'}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteBookmark(bookmark.id); }}
                      className="btn btn-danger btn-spacing"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))
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
                    <p>วันที่บันทึก: {new Date(summary.created_at).toLocaleString('th-TH')}</p>
                    <button 
                      onClick={() => handleDeleteSummary(summary.id)}
                      className="btn btn-danger btn-spacing"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

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
