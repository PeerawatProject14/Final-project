import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import TextField from '@mui/material/TextField';

const Gemini = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [userId, setUserId] = useState('1'); // ตั้งค่า user_id

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
      <h2 style={{ fontSize: '2rem' }}>GEMINI</h2>
      <p style={{ fontSize: '1.25rem' }}>กรุณาใส่ข้อมูลที่คุณต้องการสรุปงานวิจัยของคุณด้านล่างนี้</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group my-3 mx-auto" style={{ maxWidth: '600px' }}>
          <TextField
            label="ใส่รายละเอียดของงานวิจัยที่นี่..."
            variant="outlined"
            fullWidth
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">สรุป</button>
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
