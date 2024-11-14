import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Search.css';  // นำเข้าไฟล์ CSS

const Search = ({ researchData, truncateText, handleBookmark, bookmarks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredData([]);
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
      handleSearch();
    }
  };

  const handleSelect = (research) => {
    if (selectedItems.includes(research)) {
      setSelectedItems(selectedItems.filter(item => item !== research));
    } else if (selectedItems.length < 2) {
      setSelectedItems([...selectedItems, research]);
    }
  };

  const handleCompare = () => {
    if (selectedItems.length !== 2) {
      alert('กรุณาเลือกงานวิจัย 2 ชิ้นเพื่อทำการเปรียบเทียบ');
      return;
    }

    navigate('/compare', {
      state: {
        description1: selectedItems[0].description,
        description2: selectedItems[1].description,
      },
    });
  };

  return (
    <div className="search-container">
      <h2 className="search-title">ค้นหางานวิจัย</h2>
      <p className="search-subtitle">ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
      <div className="input-group search-input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder="ใส่คำค้นหาของคุณที่นี่..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary search-button" onClick={handleSearch}>ค้นหา</button>
      </div>

      <div className="research-list">
        <div className="research-container">
          {filteredData.length > 0 ? (
            <>
              <h3>ข้อมูลการวิจัย</h3>
              <div className="research-items-container">
                {filteredData.map((research) => (
                  <div key={research.id} className="research-item">
                    <Link
                      to={`/research/${research.id}`}
                      state={{ research }}
                      className="research-link"
                    >
                      <h4 className="research-title">{truncateText(research.name)}</h4>
                      <p><strong>researcher:</strong> {truncateText(research.researcher)}</p>
                      <p><strong>keyword:</strong> {truncateText(research.keyword)}</p>
                    </Link>
                    <div className="research-buttons">
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(research.id); // เรียกฟังก์ชัน handleBookmark
                    
                        }}
                        className={`btn ${bookmarks.includes(research.id) ? 'bookmark-selected' : 'outline-bookmark'}`}
                      >
                        {bookmarks.includes(research.id) ? 'ยกเลิกบุ๊คมาร์ค' : 'บุ๊คมาร์ค'}
                      </button>
                      <button
                        onClick={() => handleSelect(research)}
                        className={`btn ${selectedItems.includes(research) ? 'selected' : 'outline-selected'}`}
                      >
                        {selectedItems.includes(research) ? 'ยกเลิกเลือก' : 'เลือกเปรียบเทียบ'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary compare-button"
                onClick={handleCompare}
                disabled={selectedItems.length !== 2}
              >
                เปรียบเทียบงานวิจัย
              </button>
            </>
          ) : (
            <p className="no-results">ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
