import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

function LoginPage() {
  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-box border shadow p-4">
        <h2 className="text-center mb-4">เข้าสู่ระบบ</h2>
        <form>
          <div className="form-group mb-3">
            <label htmlFor="email">อีเมล</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="อีเมลของคุณ" 
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
              required 
            />
          </div>
          <button type="submit" className="auth-button btn btn-primary w-100">เข้าสู่ระบบ</button>
        </form>
        <p className="text-center mt-3">
          ยังไม่มีบัญชี? <Link to="/register">สมัครสมาชิก</Link> หรือ <Link to="/">Guest</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
