import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">สมัครสมาชิก</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">อีเมล</label>
            <input type="email" id="email" className="form-control" placeholder="อีเมลของคุณ" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">รหัสผ่าน</label>
            <input type="password" id="password" className="form-control" placeholder="รหัสผ่านของคุณ" />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">ยืนยันรหัสผ่าน</label>
            <input type="password" id="confirmPassword" className="form-control" placeholder="ยืนยันรหัสผ่านของคุณ" />
          </div>
          <button type="submit" className="btn btn-primary w-100">สมัครสมาชิก</button>
        </form>
        <p className="text-center mt-3">
          มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
