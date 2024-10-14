import React, { useState, useEffect } from 'react';

const ParentComponent = () => {
  const [researchData, setResearchData] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const handleBookmark = (researchId) => {
    if (bookmarks.includes(researchId)) {
      setBookmarks(bookmarks.filter(id => id !== researchId));
    } else {
      setBookmarks([...bookmarks, researchId]);
    }
  };

  useEffect(() => {
    const fetchResearchData = async () => {
      const response = await fetch('http://localhost:5000/research');
      const data = await response.json();
      setResearchData(data);
    };
    
    fetchResearchData();
  }, []);

  // ใช้ useEffect เพื่อตรวจสอบการเปลี่ยนแปลงของ bookmarks
  useEffect(() => {
    console.log('Updated bookmarks:', bookmarks);
  }, [bookmarks]);

  return (
    <div>
      <Search 
        researchData={researchData} 
        truncateText={(text) => text.length > 20 ? text.slice(0, 20) + '...' : text} 
        handleBookmark={handleBookmark} 
        bookmarks={bookmarks} 
      />
    </div>
  );
};

export default ParentComponent;
