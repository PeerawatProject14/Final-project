const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// ตั้งค่าการเชื่อมต่อกับฐานข้อมูล MySQL
const connection = mysql.createConnection({
  host: 'localhost', // หรือ IP ของเซิร์ฟเวอร์ MySQL
  user: 'root', // ชื่อผู้ใช้ MySQL
  password: '', // รหัสผ่าน MySQL
  database: 'research_db', // ชื่อฐานข้อมูล
});

// เชื่อมต่อกับ MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// ตั้งค่า CORS
const corsOptions = {
  origin: 'http://localhost:3000', // กำหนด origin ที่อนุญาต (React server)
  credentials: true, // อนุญาตให้ส่ง cookie หรือข้อมูลที่เกี่ยวข้องกับการรับรองตัวตน
  optionSuccessStatus: 200 // แก้ไขสำหรับบางเบราว์เซอร์ที่ไม่รองรับสถานะ 204
};

app.use(cors(corsOptions)); // ใช้ cors กับตัวเลือกที่ตั้งไว้

// Endpoint เพื่อตรวจสอบสถานะเซิร์ฟเวอร์
app.get('/status', (req, res) => {
  res.json({ status: 'Server is running', uptime: process.uptime() });
});

// Endpoint สำหรับดึงข้อมูลจากฐานข้อมูล
app.get('/research', (req, res) => {
  connection.query('SELECT * FROM research', (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
