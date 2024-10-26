// CompareResults.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const CompareResults = () => {
  const location = useLocation();
  const { description1, description2 } = location.state;
  const [compareResult, setCompareResult] = useState('');
  const [loading, setLoading] = useState(true); // สถานะโหลด

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
        setLoading(false); // เมื่อเสร็จสิ้นการโหลด
      }
    };

    fetchCompareResult();
  }, [description1, description2]);

  return (
    <div style={{ padding: '20px' }}>
      <h3>ผลลัพธ์การเปรียบเทียบ</h3>
      {loading ? (
        <p>กำลังโหลดข้อมูล...</p> // สัญลักษณ์โหลด
      ) : (
        <ReactMarkdown>{compareResult}</ReactMarkdown>
      )}
    </div>
  );
};

export default CompareResults;
