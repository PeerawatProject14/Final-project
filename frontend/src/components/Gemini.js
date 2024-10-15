import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Gemini = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: inputText }),
    });

    const data = await response.json();
    setResult(data); // เก็บทั้ง object ที่ได้จาก API
  };

  return (
    <>
      <h2 style={{ fontSize: '2rem' }}>GEMINI</h2>
      <p style={{ fontSize: '1.25rem' }}>กรุณาใส่ข้อมูลการสรุปงานวิจัยของคุณด้านล่างนี้</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="ใส่รายละเอียดของงานวิจัยที่นี่..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">อัพโหลดไฟล์</button>
        </div>
      </form>
      {result && (
        <div className="result-section">
          <h5>ผลลัพธ์ (Markdown):</h5>
          <ReactMarkdown>{result.output}</ReactMarkdown> {/* แสดงผลลัพธ์ในรูปแบบ Markdown */}
        </div>
      )}
    </>
  );
};

export default Gemini;
