import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css'; // import CSS file for styling

function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>สมัครสมาชิก</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input type="email" id="email" placeholder="อีเมลของคุณ" />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input type="password" id="password" placeholder="รหัสผ่านของคุณ" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
            <input type="password" id="confirmPassword" placeholder="ยืนยันรหัสผ่านของคุณ" />
          </div>
          <button type="submit" className="auth-button">สมัครสมาชิก</button>
        </form>
        <p>มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;
