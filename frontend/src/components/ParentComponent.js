import React, { useState, useEffect } from 'react';
import Gemini from './Gemini';
import Search from './Search'; // สมมติว่าคุณมีคอมโพเนนต์ Search อยู่

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
      {/* แสดงคอมโพเนนต์ Gemini พร้อมข้อมูลที่ต้องการ */}
      <Gemini 
        researchDetails={researchData.length > 0 ? researchData[0].description : ''} 
      />
      
      {/* แสดงคอมโพเนนต์ Search พร้อมข้อมูลการวิจัย */}
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
