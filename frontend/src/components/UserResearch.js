import React, { useState } from "react";
import "./Search.css";

function UserResearch() {
  const [researchDescription, setResearchDescription] = useState(""); // เพิ่ม state เพื่อเก็บ input จากผู้ใช้
  const [similarResearch, setSimilarResearch] = useState(null);

  const handleSaveData = () => {
    if (researchDescription) {
      const researchData = {
        description: researchDescription,
      };

      // ส่งข้อมูลไปยัง Express API เพื่อประมวลผลใน Python script
      fetch("http://localhost:5000/api/process-userresearch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(researchData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setSimilarResearch(data); // เก็บข้อมูลที่ส่งมาจาก Backend
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="search-container">
      <h2 className="search-title">ค้นหางานวิจัย</h2>
      <p className="search-subtitle">
        ใส่ชื่อ หรือ คำอธิบาย ของงานวิจัยที่คุณสนใจ
      </p>
      <div className="input-group search-input-group">
        <input
          type="text"
          className="form-control search-input"
          placeholder="ใส่คำค้นหาของคุณที่นี่..."
          value={researchDescription}
          onChange={(e) => setResearchDescription(e.target.value)} // อัปเดตค่า state เมื่อผู้ใช้พิมพ์
        />
        <button
          className="btn btn-primary search-button"
          onClick={handleSaveData}
        >
          ค้นหา
        </button>
      </div>
      {similarResearch && similarResearch.results && (
        
        <div className="similar-research-container">
          <h3>ผลลัพธ์ที่คล้ายกัน:</h3>
          {similarResearch.results.map((item) => (
            <div className="research-card" key={item.id}>
              <h4>{item.name}</h4>
              <p>
                <strong>id:</strong> {item.id}
              </p>
              <p>
                <strong>description:</strong> {item.description}
              </p>
              <p>
                <strong>PredictedLabel:</strong> {item.PredictedLabel}
              </p>
              <p>
                <strong>similarity:</strong> {item.similarity.toFixed(2)}
              </p>
              {/* คุณสามารถเพิ่มข้อมูลอื่น ๆ ที่ต้องการแสดงที่นี่ */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserResearch;
