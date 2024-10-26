import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleCompare = async () => {
    if (selectedItems.length !== 2) {
      alert('กรุณาเลือกงานวิจัย 2 ชิ้นเพื่อทำการเปรียบเทียบ');
      return;
    }

    // Navigating to a new page with the selected research descriptions
    navigate('/compare', {
      state: {
        description1: selectedItems[0].description,
        description2: selectedItems[1].description,
      },
    });
  };

  return (
    <>
      <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>ค้นหางานวิจัย</h2>
      <p style={{ fontSize: '1.25rem', textAlign: 'center' }}>ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ</p>
      <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="ใส่คำค้นหาของคุณที่นี่..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={handleSearch}>ค้นหา</button>
      </div>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <div style={{ width: '60%' }}>
          {filteredData.length > 0 ? (
            <>
              <h3>ข้อมูลการวิจัย</h3>
              <div style={{ maxHeight: '550px', overflowY: 'auto' }} className="mb-3">
                {filteredData.map((research) => (
                  <div key={research.id} style={{ width: '100%', marginBottom: '20px' }}>
                    <Link
                      to={`/research/${research.id}`}
                      state={{ research }}
                      style={{
                        display: 'block',
                        minHeight: '100px',
                        maxHeight: '300px',
                        overflow: 'hidden',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#fff',
                        transition: 'max-height 0.3s ease',
                      }}
                    >
                      <h4>{truncateText(research.name)}</h4>
                      <p><strong>researcher:</strong> {truncateText(research.researcher)}</p>
                      <p><strong>keyword:</strong> {truncateText(research.keyword)}</p>
                    </Link>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(research.id);
                        }}
                        className={`btn ${bookmarks.includes(research.id) ? 'btn-warning' : 'btn-outline-warning'}`}
                      >
                        {bookmarks.includes(research.id) ? 'ยกเลิกบุ๊คมาร์ค' : 'บุ๊คมาร์ค'}
                      </button>
                      <button
                        onClick={() => handleSelect(research)}
                        className={`btn ${selectedItems.includes(research) ? 'btn-success' : 'btn-outline-success'}`}
                      >
                        {selectedItems.includes(research) ? 'ยกเลิกเลือก' : 'เลือกเปรียบเทียบ'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={handleCompare}
                disabled={selectedItems.length !== 2}
              >
                เปรียบเทียบงานวิจัย
              </button>
            </>
          ) : (
            <p>ไม่พบข้อมูลที่ตรงกับการค้นหา</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
