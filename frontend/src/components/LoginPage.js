import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // สถานะสำหรับ userId

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
        localStorage.setItem('userId', data.userId); // เก็บ userId ลงใน localStorage
        setUserId(data.userId); // อัปเดต userId state
        
        alert('Login successful: ' + JSON.stringify(data));
      
        navigate('/');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-box border shadow p-4">
        <h2 className="text-center mb-4">เข้าสู่ระบบ</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
        {loading && <div className="alert alert-info">Loading...</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">อีเมล</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="อีเมลของคุณ" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">รหัสผ่าน</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="รหัสผ่านของคุณ" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-button btn btn-primary w-100" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <p className="text-center mt-3">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link> หรือ <Link to="/">Guest</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
