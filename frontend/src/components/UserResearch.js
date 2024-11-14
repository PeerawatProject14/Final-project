import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css";

function UserResearch() {
  const [researchDescription, setResearchDescription] = useState("");
  const [similarResearch, setSimilarResearch] = useState(null);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  // ตรวจสอบสถานะการล็อกอินและล้างข้อมูลหากยังไม่ได้ล็อกอิน
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // ถ้าล็อกอินแล้ว ดึงข้อมูลจาก localStorage ที่แยกตาม userId
      const storedDescription = localStorage.getItem(`researchDescription_${userId}`);
      const storedResearch = localStorage.getItem(`similarResearch_${userId}`);
      const storedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`)) || [];

      if (storedDescription) {
        setResearchDescription(storedDescription);
      }

      if (storedResearch) {
        setSimilarResearch(JSON.parse(storedResearch));
      }

      setBookmarks(storedBookmarks);
    } else {
      // ถ้าไม่ได้ล็อกอิน (Guest) ใช้ข้อมูลที่ไม่ได้เก็บใน localStorage
      setResearchDescription(""); // เริ่มต้นช่องค้นหาว่าง
      setSimilarResearch(null); // ไม่มีผลลัพธ์
      setBookmarks([]); // ไม่มีบุ๊คมาร์ค
    }
  }, []);

  const handleSaveData = () => {
    const userId = localStorage.getItem("userId");

    // ถ้าล็อกอินแล้วให้เก็บข้อมูลใน localStorage สำหรับ userId
    if (researchDescription) {
      const researchData = { description: researchDescription };

      if (userId) {
        // สำหรับผู้ใช้ที่ล็อกอิน
        localStorage.setItem(`researchDescription_${userId}`, researchDescription);

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
            setSimilarResearch(data);
            localStorage.setItem(`similarResearch_${userId}`, JSON.stringify(data));
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        // สำหรับผู้ใช้ที่ไม่ได้ล็อกอิน (Guest)
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
            setSimilarResearch(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  };

  const handleBookmark = async (researchId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem("userId");

    if (userId) {
      // สำหรับผู้ใช้ที่ล็อกอิน
      try {
        const response = await fetch("http://localhost:5000/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ research_id: researchId, user_id: userId }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        alert("บุ๊คมาร์คสำเร็จ!");

        const updatedBookmarks = [...bookmarks, researchId];
        setBookmarks(updatedBookmarks);
        localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
      } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการบุ๊คมาร์ค");
      }
    } else {
      // สำหรับ guest
      alert("กรุณาล็อกอินก่อนเพื่อบุ๊คมาร์ค");
    }
  };

  const handleSelectForComparison = (item, e) => {
    e.stopPropagation();
    // ถ้ากดเลือกแล้วจะยกเลิกการเลือก
    if (selectedResearch === item) {
      setSelectedResearch(null); // ยกเลิกการเลือก
    } else {
      setSelectedResearch(item); // เลือกงานวิจัยใหม่
    }
  };

  const handleConfirmComparison = () => {
    // ตรวจสอบ userId ใน localStorage
    if (!localStorage.getItem("userId")) {
      alert("กรุณาล็อกอินก่อนเพื่อเลือกเปรียบเทียบ");
      return;
    }
  
    if (!selectedResearch) {
      alert("กรุณาเลือกงานวิจัยที่ต้องการเปรียบเทียบ");
      return;
    }
  
    const confirmed = window.confirm(
      `คุณต้องการเปรียบเทียบงานวิจัย: ${selectedResearch.name} หรือไม่?`
    );
  
    if (confirmed) {
      navigate("/compare", {
        state: {
          description1: researchDescription,
          description2: selectedResearch.description,
        },
      });
    }
  };
  

  const handleCardClick = (item) => {
    navigate(`/user-research/${item.id}`);
  };

  return (
    <div className="search-container">
      <h2 className="search-title">ค้นหางานวิจัยที่คล้ายกับงานวิจัยของคุณ</h2>
      <p className="search-subtitle">
        กรุณากรอกคำอธิบายงานวิจัยของคุณในช่องค้นหา
        เพื่อให้ระบบสามารถวิเคราะห์และค้นหางานวิจัยที่มีเนื้อหาคล้ายคลึงกันได้อย่างแม่นยำ
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
            <div className="research-card-box" key={item.id}>
              <div
                className="research-card"
                onClick={() => handleCardClick(item)}
              >
                <h4>{item.name}</h4>
                <p>
                  <strong>id:</strong> {item.id}
                </p>
                <p>
                  <strong>description:</strong> {item.description}
                </p>
                <div className="research-buttons">
                  <button
                    onClick={(e) => handleBookmark(item.id, e)}
                    className={`btn ${
                      bookmarks.includes(item.id)
                        ? "bookmark-selected"
                        : "outline-bookmark"
                    }`}
                  >
                    {bookmarks.includes(item.id) ? "ยกเลิกบุ๊คมาร์ค" : "บุ๊คมาร์ค"}
                  </button>
                  <button
                    onClick={(e) => handleSelectForComparison(item, e)}
                    className={`btn ${
                      selectedResearch === item ? "selected" : "outline-selected"
                    }`}
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
  );
}

export default UserResearch;
