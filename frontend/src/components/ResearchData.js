import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResearchData.css';

const ResearchData = () => {
  const { research_id } = useParams();
  const navigate = useNavigate();
  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storedResearch, setStoredResearch] = useState(null); // เพิ่มที่นี่
  const [similarResearch, setSimilarResearch] = useState(null);
  const [selectedResearch, setSelectedResearch] = useState(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSaveData = () => {
    if (research) {
      const researchData = {
        id: research.id,
        name: research.name,
        description: research.description,
        PredictedLabel: research.PredictedLabel,
        embedding: research.embedding,
      };
      setStoredResearch(researchData);  // ใช้ setStoredResearch เพื่อเก็บข้อมูล

      fetch('http://localhost:5000/api/process-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(researchData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setSimilarResearch(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/research/${research_id}`);
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลได้');
        }
        const data = await response.json();
        setResearch(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchData();
  }, [research_id]);

  const handleSelectForComparison = (item, e) => {
    e.stopPropagation();
    if (selectedResearch === item) {
      setSelectedResearch(null);
    } else {
      setSelectedResearch(item);
    }
  };

  const handleConfirmComparison = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('กรุณาล็อกอินก่อนที่จะทำการเปรียบเทียบ');
      return;
    }

    if (!selectedResearch) {
      alert('กรุณาเลือกงานวิจัยที่ต้องการเปรียบเทียบ');
      return;
    }

    const confirmed = window.confirm(
      `คุณต้องการเปรียบเทียบงานวิจัย: ${selectedResearch.name} หรือไม่?`
    );

    if (confirmed) {
      navigate("/compare", {
        state: {
          description1: research.description,
          description2: selectedResearch.description,
        },
      });
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!research) {
    return <p>ไม่พบข้อมูล</p>;
  }

  return (
    <main className="research-data-container">
      <div className="research-detail-card">
        <button onClick={handleBackClick} className="btn btn-secondary mb-3">กลับ</button>
        <h2 className="research-title">{research.name}</h2>
        <p><strong>id:</strong> {research.id}</p>
        <p><strong>doi:</strong> {research.doi}</p>
        <p><strong>name:</strong> {research.name}</p>
        <p><strong>co_researcher:</strong> {research.co_researcher}</p>
        <p><strong>institution:</strong> {research.institution}</p>
        <p><strong>year:</strong> {research.year}</p>
        <p><strong>อ้างอิง URL:</strong> {research.url}</p>
        <p><strong>description:</strong> {research.description}</p>
        <p><strong>keyword:</strong> {research.keyword}</p>

        <div className="center-button">
          <button onClick={handleSaveData} className="btn btn-primary mb-3">ค้นหางานวิจัยที่คล้ายกัน</button>
        </div>

        {similarResearch && similarResearch.results && (
          <div className="similar-research-container">
            {similarResearch.results.map((item) => (
              <div className="research-card-box" key={item.id}>
                <div className="research-card">
                  <h4>{item.name}</h4>
                  <p><strong>id:</strong> {item.id}</p>
                  <p><strong>description:</strong> {item.description}</p>

                  <div className="research-buttons">
                    <button
                      onClick={(e) => handleSelectForComparison(item, e)}
                      className={`btn ${selectedResearch === item ? "selected" : "outline-selected"}`}
                    >
                      {selectedResearch === item ? "ยกเลิกเลือก" : "เลือกเปรียบเทียบ"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="btn btn-primary compare-button-x"
              onClick={handleConfirmComparison}
              disabled={!selectedResearch}
            >
              ยืนยันเปรียบเทียบ
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ResearchData;
