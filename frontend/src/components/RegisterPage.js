import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // ใช้ useNavigate แทน useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // ตรวจสอบความถูกต้องของรหัสผ่าน
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password.match(passwordCriteria)) {
      setError('รหัสผ่านต้องมีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ ตัวเลข และมีความยาวมากกว่า 8 ตัวอักษร');
      return;
    }
  
    // ตรวจสอบรหัสผ่าน
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        setSuccess('ลงทะเบียนสำเร็จ!');
        navigate('/login'); // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
      } else if (response.status === 409) { // เช็กสถานะ 409 (Conflict)
        const data = await response.json();
        setError(data.message || 'อีเมลนี้ได้ถูกลงทะเบียนแล้ว');
      } else {
        const data = await response.json();
        setError('เกิดข้อผิดพลาดในการลงทะเบียน: ' + data.message);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน: ' + err.message);
    }
  };
  

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-box border shadow p-4">
        <h2 className="text-center mb-4">สมัครสมาชิก</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <div className="mb-3 form-group">
            <label htmlFor="email" className="form-label">อีเมล</label>
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
          <div className="mb-3 form-group">
            <label htmlFor="password" className="form-label">รหัสผ่าน</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="รหัสผ่านของคุณ (อย่างน้อย 8 ตัวอักษร, มีตัวพิมพ์เล็ก ตัวพิมพ์ใหญ่ และตัวเลข)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <div className="mb-3 form-group">
            <label htmlFor="confirmPassword" className="form-label">ยืนยันรหัสผ่าน</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="form-control" 
              placeholder="ยืนยันรหัสผ่านของคุณ" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="auth-button btn btn-primary w-100">สมัครสมาชิก</button>
        </form>
        <p className="text-center mt-3">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
