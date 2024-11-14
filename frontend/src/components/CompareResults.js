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
  const [isSaved, setIsSaved] = useState(false); // สถานะการบันทึก
  const [error, setError] = useState(null); // สถานะสำหรับ error
  const userId = localStorage.getItem('userId'); // ดึง userId จาก localStorage

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
          const errorText = await response.text();
          setError(`Error: ${response.status} - ${response.statusText}`);
          throw new Error(errorText);
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

  const handleSave = async () => {
    if (isSaved) return; // หากบันทึกไปแล้วจะไม่ทำการบันทึกซ้ำ

    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ output: compareResult, user_id: userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error: ${response.status} - ${response.statusText}`);
        throw new Error(errorText);
      }

      const data = await response.json();
      if (data.message) {
        alert('บันทึกข้อมูลสำเร็จ');
        setIsSaved(true); // อัพเดตสถานะว่าได้บันทึกแล้ว
      } else {
        alert('การบันทึกข้อมูลล้มเหลว');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('การบันทึกข้อมูลล้มเหลว');
    }
  };

  return (
    <div className="background-container">
      <div className="container">
        <h3 className="heading">ผลลัพธ์การเปรียบเทียบ</h3>
        {loading ? (
          <p className="loading">กำลังโหลดข้อมูล...</p>
        ) : (
          <>
            {error && <p className="error-message">{error}</p>}
            <ReactMarkdown className="result">{compareResult}</ReactMarkdown>
            <div className="button-container">
              <button
                className="saveButton"
                onClick={handleSave}
                disabled={isSaved} // ทำให้ปุ่มไม่สามารถกดได้หลังจากบันทึกสำเร็จ
              >
                {isSaved ? 'บันทึกสำเร็จ' : 'บันทึกผล'}
              </button>
              <button className="backButton" onClick={() => navigate(-1)}>
                กลับ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompareResults;
