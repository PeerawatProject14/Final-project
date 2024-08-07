import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';  // Import CSS file

const App = () => {
  const [inputValue1, setInputValue1] = useState("");  // Input value for Script 1
  const [inputValue2, setInputValue2] = useState("");  // Input value for Script 2
  const [response1, setResponse1] = useState([]);  // Response from Script 1
  const [response2, setResponse2] = useState([]);  // Response from Script 2
  const [serverStatus, setServerStatus] = useState("");
  const [loading1, setLoading1] = useState(false);  // Loading state for Script 1
  const [loading2, setLoading2] = useState(false);  // Loading state for Script 2
  const [completed1, setCompleted1] = useState(false);  // Completed state for Script 1
  const [completed2, setCompleted2] = useState(false);  // Completed state for Script 2
  const [error, setError] = useState("");  // Error state

  const handleInputChange1 = (event) => {
    setInputValue1(event.target.value);
    setError("");  // Clear error when input changes
  };

  const handleInputChange2 = (event) => {
    setInputValue2(event.target.value);
    setError("");  // Clear error when input changes
  };

  const sendDataToNodeServer1 = async () => {
    if (serverStatus !== "Server ทำงานปกติ") {
      console.log("Server ไม่ทำงาน ไม่สามารถส่งข้อมูลได้");
      setError("Server ไม่ทำงาน ไม่สามารถส่งข้อมูลได้");
      return;
    }
    if (inputValue1.trim() === "") {
      setError("กรุณากรอกข้อมูลก่อนส่ง");
      return;
    }
    setLoading1(true);  // Start loading for Script 1
    setCompleted1(false);  // Reset completed state for Script 1

    try {
      const response = await axios.post(`http://localhost:5000/sendDataToScript1`, {
        data: inputValue1,
      });

      setResponse1(response.data);
      setCompleted1(true);  // Mark as completed for Script 1
    } catch (error) {
      console.error("เกิดปัญหาจากการส่งข้อมูลไปที่ Node.js", error);
      setError("เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading1(false);  // End loading for Script 1
    }
  };

  const sendDataToNodeServer2 = async () => {
    if (serverStatus !== "Server ทำงานปกติ") {
      console.log("Server ไม่ทำงาน ไม่สามารถส่งข้อมูลได้");
      setError("Server ไม่ทำงาน ไม่สามารถส่งข้อมูลได้");
      return;
    }
    if (inputValue2.trim() === "") {
      setError("กรุณากรอกข้อมูลก่อนส่ง");
      return;
    }
    setLoading2(true);  // Start loading for Script 2
    setCompleted2(false);  // Reset completed state for Script 2

    try {
      const response = await axios.post(`http://localhost:5001/sendDataToScript2`, {
        data: inputValue2,
      });

      setResponse2(response.data);
      setCompleted2(true);  // Mark as completed for Script 2
    } catch (error) {
      console.error("เกิดปัญหาจากการส่งข้อมูลไปที่ Node.js", error);
      setError("เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setLoading2(false);  // End loading for Script 2
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
      <p className={`server-status ${serverStatus === "Server ทำงานปกติ" ? 'status-ok' : 'status-error'}`}>
        สถานะของเซิร์ฟเวอร์: {serverStatus}
      </p>
      <div className="main-container">
        {/* Section for Script 1 */}
        <div className="script-container-left">
          <div className="script-section">
            <h2 className="section-title">Script 1</h2>
            <div className="form-container">
              <textarea
                value={inputValue1}
                onChange={handleInputChange1}
                placeholder="กรุณาป้อนข้อความสำหรับ Script 1 ที่นี่"
                className="input-field"
              />
              <button 
                onClick={sendDataToNodeServer1} 
                className="submit-button"
                disabled={loading1 || inputValue1.trim() === ""}  // Disable button when loading or input is empty
              >
                ส่งข้อมูลสำหรับ Script 1
              </button>
            </div>
            {error && <p className="error-text">{error}</p>}  {/* Display error message */}
            {loading1 && (
              <div className="loading-container">
                <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-15-221_512.gif" alt="Loading..." className="spinner" />
                <p className="loading-text">กำลังส่งข้อมูลสำหรับ Script 1...</p>
              </div>
            )}
            {!loading1 && completed1 && response1.length > 0 && (
              <p className="completed-text">การทำงานเสร็จสิ้นสำหรับ Script 1</p>
            )}
            {!loading1 && completed1 && response1.length === 0 && (
              <p className="no-results-text">ไม่พบข้อมูลที่คล้ายคลึงสำหรับ Script 1</p>
            )}
            {!loading1 && response1.length > 0 && (
              <ul className="results-list">
                {response1.map((result, index) => (
                  <li key={index} className="result-item">
                    <p className="result-description">{result.description}</p>
                    <p className="result-similarity">ความคล้าย : {result.similarity_percentage.toFixed(2)}%</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Section for Script 2 */}
        <div className="script-container-right">
          <div className="script-section">
            <h2 className="section-title">Script 2</h2>
            <div className="form-container">
              <textarea
                value={inputValue2}
                onChange={handleInputChange2}
                placeholder="กรุณาป้อนข้อความสำหรับ Script 2 ที่นี่"
                className="input-field"
              />
              <button 
                onClick={sendDataToNodeServer2} 
                className="submit-button"
                disabled={loading2 || inputValue2.trim() === ""}  // Disable button when loading or input is empty
              >
                ส่งข้อมูลสำหรับ Script 2
              </button>
            </div>
            {loading2 && (
              <div className="loading-container">
                <img src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-15-221_512.gif" alt="Loading..." className="spinner" />
                <p className="loading-text">กำลังส่งข้อมูลสำหรับ Script 2...</p>
              </div>
            )}
            {!loading2 && completed2 && response2.length > 0 && (
              <p className="completed-text">การทำงานเสร็จสิ้นสำหรับ Script 2</p>
            )}
            {!loading2 && completed2 && response2.length === 0 && (
              <p className="no-results-text">ไม่พบข้อมูลที่คล้ายคลึงสำหรับ Script 2</p>
            )}
            {!loading2 && response2.length > 0 && (
              
                response2
                 
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
