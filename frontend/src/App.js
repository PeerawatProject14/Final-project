import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';  // Import CSS file

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState([]);
  const [serverStatus, setServerStatus] = useState("");
  const [loading, setLoading] = useState(false);  // Added loading state
  const [completed, setCompleted] = useState(false);  // Added completed state
  const [error, setError] = useState("");  // Added error state

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setError("");  // Clear error when input changes
  };

  const sendDataToNodeServer = async () => {
    if (serverStatus !== "Server ทำงานปกติ") {
      console.log("Server ไม่ทำงาน ไม่สามารถส่งข้อมูลได้");
      setError("Server ไม่ทำงาน ไม่สามารถส่งข้อมูลได้");
      return;
    }
    if (inputValue.trim() === "") {
      setError("กรุณากรอกข้อมูลก่อนส่ง");
      return;
    }
    setLoading(true);  // Start loading
    setCompleted(false);  // Reset completed state

    try {
      const response = await axios.post("http://localhost:5000/sendData", {
        data: inputValue,
      });
      setResponse(response.data);
      setCompleted(true);  // Mark as completed
    } catch (error) {
      console.error("เกิดปัญหาจากการส่งข้อมูลไปที่ Node.js", error);
      setError("เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading(false);  // End loading
    }
  };

  const checkServerStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      if (response.status === 200) {
        setServerStatus("Server ทำงานปกติ");
      } else {
        setServerStatus("Server ไม่ทำงาน");
      }
    } catch (error) {
      setServerStatus("Server ไม่ทำงาน");
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  return (
    <div className="app-container">
      <h1 className="app-title">ทดสอบประโยค</h1>
      <div className="form-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="กรุณาป้อนข้อความของคุณที่นี่"
          className="input-field"
        />
        <button 
          onClick={sendDataToNodeServer} 
          className="submit-button"
          disabled={loading || inputValue.trim() === ""}  // Disable button when loading or input is empty
        >
          ส่ง
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}  {/* Display error message */}
      <p className={`server-status ${serverStatus === "Server ทำงานปกติ" ? 'status-ok' : 'status-error'}`}>
        สถานะของเซิร์ฟเวอร์: {serverStatus}
      </p>
      {loading && (
        <div className="loading-container">
          <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-15-221_512.gif" alt="Loading..." className="spinner" />
          <p className="loading-text">กำลังส่งข้อมูล...</p>
        </div>
      )}
      {!loading && completed && response.length > 0 && (
        <p className="completed-text">การทำงานเสร็จสิ้น</p>
      )}
      {!loading && completed && response.length === 0 && (
        <p className="no-results-text">ไม่พบข้อมูลที่คล้ายคลึง</p>
      )}
      {!loading && response.length > 0 && (
        <ul className="results-list">
          {response.map((result, index) => (
            <li key={index} className="result-item">
              <p className="result-description">{result.description}</p>
              <p className="result-similarity">ความคล้าย : {result.similarity_percentage.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
