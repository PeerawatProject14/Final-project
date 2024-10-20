import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Gemini = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const userId = localStorage.getItem('userId'); // ดึง userId จาก localStorage

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

  const handleSave = async () => {
    if (result && result.output) {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ output: result.output, user_id: userId }), // ส่ง output และ user_id
      });

      const data = await response.json();
      if (data.message) {
        alert('บันทึกข้อมูลสำเร็จ');
      } else {
        alert('การบันทึกข้อมูลล้มเหลว');
      }
    }
  };

  return (
    <>
      <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>GEMINI</h2>
      <p style={{ fontSize: '1.25rem', textAlign: 'center' }}>กรุณาใส่ข้อมูลที่คุณต้องการสรุปงานวิจัยของคุณด้านล่างนี้</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
          <textarea
            className="form-control"
            placeholder="ใส่รายละเอียดของงานวิจัยที่นี่..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              height: '150px', // ขยายความสูงของ textarea
              resize: 'none',  // ปิดการปรับขนาดด้วยมือ
              padding: '15px',
              fontSize: '1.2rem',
            }}
          />
        </div>
        {/* ปุ่มอยู่ด้านล่างและกลาง */}
        <div className="text-center">
          <button className="btn btn-primary mt-3" type="submit">สรุป</button>
        </div>
      </form>
      {result && (
        <div className="result-section">
          <h5>ผลลัพธ์</h5>
          <ReactMarkdown>{result.output}</ReactMarkdown> {/* แสดงผลลัพธ์ในรูปแบบ Markdown */}
          <button className="btn btn-success mt-3" onClick={handleSave}>บันทึกผล</button> {/* ปุ่มบันทึกผล */}
        </div>
      )}
    </>
  );
};

export default Gemini;
