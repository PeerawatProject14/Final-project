// CompareResults.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './CompareResults.css';

const CompareResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { description1, description2 } = location.state;
  const [compareResult, setCompareResult] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompareResult = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description1,
            description2,
          }),
        });

        if (!response.ok) {
          throw new Error('Error comparing research');
        }

        const data = await response.json();
        setCompareResult(data.output);
      } catch (error) {
        console.error('Error comparing research:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompareResult();
  }, [description1, description2]);

  return (
    <div className="background-container">
      <div className="container">
        <h3 className="heading">ผลลัพธ์การเปรียบเทียบ</h3>
        {loading ? (
          <p className="loading">กำลังโหลดข้อมูล...</p>
        ) : (
          <ReactMarkdown className="result">{compareResult}</ReactMarkdown>
        )}
        <button className="backButton" onClick={() => navigate(-1)}>
          กลับ
        </button>
      </div>
    </div>
  );
};

export default CompareResults;
