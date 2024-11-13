import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function UserResearch() {
  const [researchDescription, setResearchDescription] = useState(""); // เก็บ input จากผู้ใช้
  const [similarResearch, setSimilarResearch] = useState(null);
  const navigate = useNavigate(); // hook สำหรับการนำทาง

  // เมื่อโหลดหน้าให้ตรวจสอบว่าใน localStorage มีข้อมูลหรือไม่
  useEffect(() => {
    const storedDescription = localStorage.getItem("researchDescription");
    const storedResearch = localStorage.getItem("similarResearch");

    if (storedDescription) {
      setResearchDescription(storedDescription); // ถ้ามีข้อมูลจากการค้นหาครั้งก่อนให้แสดง
    }

    if (storedResearch) {
      setSimilarResearch(JSON.parse(storedResearch)); // ถ้ามีข้อมูลผลลัพธ์การค้นหาจากครั้งก่อนให้แสดง
    }
  }, []);

  const handleSaveData = () => {
    if (researchDescription) {
      const researchData = {
        description: researchDescription,
      };

      // เก็บคำอธิบายใน localStorage
      localStorage.setItem("researchDescription", researchDescription);

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
          // เก็บผลลัพธ์การค้นหาใน localStorage
          localStorage.setItem("similarResearch", JSON.stringify(data));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleCardClick = (item) => {
    navigate(`/user-research/${item.id}`); // นำทางไปที่หน้า UserResearchDetail
  };

  return (
    <div className="search-container">
      <h2 className="search-title">ค้นหางานวิจัยที่คล้ายกับงานวิจัยของคุณ</h2>
      <p className="search-subtitle">
        กรุณากรอกคำอธิบายงานวิจัยของคุณในช่องค้นหา
        เพื่อให้ระบบสามารถวิเคราะห์และค้นหางานวิจัยที่มีเนื้อหาคล้ายคลึงกันได้อย่างแม่นยำ
        ข้อแนะนำเพิ่มเติม: โปรดใช้ประโยคที่มีความยาวเพียงพอและชัดเจน
        ไม่ควรใส่คำอธิบายสั้นเกินไปหรือใช้อักษรพิเศษ เช่น อิโมจิ จุดขีดเส้น
        หรือสัญลักษณ์พิเศษต่างๆ
        เพื่อให้ได้ผลลัพธ์การค้นหาที่มีความเกี่ยวข้องมากที่สุด
      </p>
      <div className="custom-search-container">
        <textarea
          className="custom-textarea"
          placeholder="ใส่คำค้นหาของคุณที่นี่..."
          value={researchDescription}
          onChange={(e) => setResearchDescription(e.target.value)}
        />
        <button className="custom-search-button" onClick={handleSaveData}>
          ค้นหา
        </button>
      </div>
      {similarResearch && similarResearch.results && (
        <div className="similar-research-container">
          <h3>ผลลัพธ์ที่คล้ายกัน:</h3>
          {similarResearch.results.map((item) => (
            <div className="research-card-box">
              <div
                className="research-card"
                key={item.id}
                onClick={() => handleCardClick(item)}
              >
                <h4>{item.name}</h4>
                <p>
                  <strong>id:</strong> {item.id}
                </p>
                <p>
                  <strong>description:</strong> {item.description}
                </p>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserResearch;
