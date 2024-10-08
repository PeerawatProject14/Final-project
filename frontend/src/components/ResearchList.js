import React from 'react';

const ResearchList = ({ researchData, truncateText }) => {
  return (
    <div style={{ maxHeight: '550px', overflowY: 'auto' }} className="mb-7">
      <div className="d-flex flex-column justify-content-center align-items-center gap-3">
        {researchData.map((research) => (
          <div
            key={research.id}
            style={{
              width: '80%', // การ์ดยืดเต็มความกว้าง
              height: '80%',
              border: '1px solid #ccc',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              padding: '40px',
              backgroundColor: '#fff',
            }}
          >
            <h4>{truncateText(research.ชื่อเรื่อง)}</h4>
            <p><strong>ชื่อนักวิจัย:</strong> {truncateText(research.ชื่อนักวิจัย)}</p>
            <p><strong>คำสำคัญ:</strong> {truncateText(research.คำสำคัญ)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchList;