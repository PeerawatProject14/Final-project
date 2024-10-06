const express = require('express');
const cors = require('cors'); // ใช้ cors เพื่อให้สามารถเชื่อมต่อกับ React ได้
const app = express();
const port = 5000;

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
