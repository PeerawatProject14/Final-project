import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css'; // import CSS file for styling

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>เข้าสู่ระบบ</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">อีเมล</label>
            <input type="email" id="email" placeholder="อีเมลของคุณ" />
          </div>
          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input type="password" id="password" placeholder="รหัสผ่านของคุณ" />
          </div>
          <button type="submit" className="auth-button">เข้าสู่ระบบ</button>
        </form>
        <p>ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
