const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 5000;

// กำหนดค่า CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// POST endpoint เพื่อรับข้อมูลจาก React สำหรับ Python Script 1
app.post('/sendDataToScript1', async (req, res) => {
  const { data } = req.body;

  const pythonExecutable = 'C:/Users/admin/AppData/Local/Programs/Python/Python39/python.exe';
  const pythonScriptPath = 'C:/Users/admin/OneDrive/เอกสาร/GitHub/Final-project/Backend/pyshell.py';

  try {
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath]);

    let responseData = '';

    pythonProcess.stdin.write(data);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      responseData += data.toString('utf-8');
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.send(responseData);  // ส่งกลับ React
      } else {
        console.error(`python เกิดปัญหารหัส ${code}`);
        res.status(500).send('เกิดข้อผิดพลาด');
      }
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดจากการติดต่อกับ python :', error);
    res.status(500).send('เกิดข้อผิดพลาดในการสื่อสารกับ python');
  }
});

// ให้หน้า server แสดงถ้าใช้ได้ปกติ
app.get('/', (req, res) => {
  res.send('Server ทำงานปกติ');
});

// โชว์ว่าที่ terminal ว่า server ทำงานแล้ว
app.listen(port, () => {
  console.log(`Node.js server กำลังทำงานอยู่ที่ http://localhost:${port}`);
});
