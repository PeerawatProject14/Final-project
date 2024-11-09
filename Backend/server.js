const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;
const apiKey = "API KEY";
const genAI = new GoogleGenerativeAI(apiKey);

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'research_db',
};

// กำหนดค่า CORS
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
}));
app.use(express.json()); // เพื่อให้สามารถรับ JSON body ได้
app.use(bodyParser.json());

// Endpoint สำหรับการประมวลผลข้อมูลใน Python script
app.post('/api/process-research', async (req, res) => {
  const storedResearch = req.body;

  console.log("Received data from React:", storedResearch);

  if (!storedResearch) {
    return res.status(400).json({ error: 'Stored research data is required' });
  }

  // เรียกใช้ Python script
  const pythonProcess = spawn('python', ['TestCosine.py']);

  // ส่งข้อมูลไปยัง Python script
  pythonProcess.stdin.write(JSON.stringify(storedResearch));
  pythonProcess.stdin.end();

  let dataToSend = '';
  pythonProcess.stdout.on('data', (data) => {
    dataToSend += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);

    if (dataToSend) {
      try {
        const jsonResponse = JSON.parse(dataToSend);
        
        // แสดงข้อมูลที่ได้รับจาก Python ใน terminal
        console.log("Data received from Python:", jsonResponse);
        
        res.json(jsonResponse); // ส่งข้อมูลกลับไปยัง React
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ error: 'Error parsing JSON response' });
      }
    } else {
      res.status(500).json({ error: 'No data received from Python script' });
    }
  });
});

// ฟังก์ชันสำหรับเข้ารหัสรหัสผ่านด้วย PBKDF2
async function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex'); // สร้าง salt ใหม่ถ้าไม่มี
  }

  const iterations = 10000;
  const keylen = 64;
  const digest = 'sha512';

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });

  return { hashedPassword: derivedKey, salt };
}

// ฟังก์ชันสำหรับเปรียบเทียบรหัสผ่าน
async function verifyPassword(inputPassword, hashedPassword, salt) {
  const { hashedPassword: inputHashedPassword } = await hashPassword(inputPassword, salt);
  return inputHashedPassword === hashedPassword;
}

// Endpoint สำหรับการลงทะเบียนผู้ใช้
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const { hashedPassword, salt } = await hashPassword(password); // เข้ารหัสรหัสผ่านด้วย PBKDF2

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO user (email, password, salt) VALUES (?, ?, ?)',
      [email, hashedPassword, salt]
    );

    res.status(201).json({ id: result.insertId, email });
  } catch (err) {
    console.error('Error registering user:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Endpoint สำหรับการเข้าสู่ระบบผู้ใช้
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await verifyPassword(password, user.password, user.salt); // ตรวจสอบรหัสผ่าน

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // รหัสผ่านถูกต้อง ให้ส่งข้อมูลผู้ใช้
    res.json({ message: 'Login successful', userId: user.id, email: user.email });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Endpoint สำหรับดึงข้อมูลจากฐานข้อมูล
app.get('/research', async (req, res) => {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute('SELECT * FROM research');
    res.json(results);
  } catch (err) {
    console.error('Error fetching research data:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});
app.post('/api/generate', async (req, res) => {
  const { input } = req.body;

  // ตรวจสอบว่ามีการส่ง input มาหรือไม่
  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro",systemInstruction: "สรุปบทความงานวิจัย" });
    const result = await model.generateContent([input]);
    
    // ส่งผลลัพธ์เป็น JSON
    res.json({ output: result.response.text() });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: 'Error generating content' });
  }
});

// Endpoint สำหรับการบันทึกข้อมูลลงฐานข้อมูล
app.post('/api/save', async (req, res) => {
  const { output, user_id } = req.body;
  

  if (!output || !user_id) {
    return res.status(400).json({ error: 'Output and user_id are required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = 'INSERT INTO gemini (summary, user_id) VALUES (?, ?)';
    const [result] = await connection.execute(sql, [output, user_id]);
    res.json({ message: 'บันทึกข้อมูลสำเร็จ', id: result.insertId });
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Error saving data' });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint สำหรับการเปรียบเทียบงานวิจัย
app.post('/api/compare', async (req, res) => {
  const { description1, description2 } = req.body;

  // ตรวจสอบว่าได้รับ description ทั้งสองรายการหรือไม่
  if (!description1 || !description2) {
    return res.status(400).json({ error: 'Descriptions for both research items are required' });
  }

  try {
    // ตั้งค่าการใช้ระบบสำหรับการเปรียบเทียบ
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: "เปรียบเทียบงานวิจัย และหาความคล้ายกัน และการนำมาประยุกต์ใช้ร่วมกัน(ตอบมาเยอะๆ)"
    });

    // ส่งคำอธิบายสองรายการเพื่อให้โมเดลทำการเปรียบเทียบ
    const result = await model.generateContent([description1, description2]);

    // ส่งผลลัพธ์การเปรียบเทียบกลับเป็น JSON
    res.json({ output: result.response.text() });
  } catch (error) {
    console.error("Error comparing research:", error);
    res.status(500).json({ error: 'Error comparing research' });
  }
});

// Endpoint สำหรับเพิ่ม bookmark
app.post('/bookmarks', async (req, res) => {
  const { research_id } = req.body;
  const user_id = req.body.user_id; // คุณสามารถส่ง user_id มาจาก frontend ได้

  if (!research_id || !user_id) {
    return res.status(400).json({ message: 'Research ID and user ID are required' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO bookmark (research_id, user_id) VALUES (?, ?)',
      [research_id, user_id]
    );

    res.status(201).json({ id: result.insertId, research_id, user_id });
  } catch (err) {
    console.error('Error adding bookmark:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Endpoint สำหรับดึง bookmark ของผู้ใช้
app.get('/bookmarks/:user_id', async (req, res) => {
  const user_id = req.params.user_id;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      'SELECT * FROM bookmark WHERE user_id = ?',
      [user_id]
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.get('/research/:research_id', async (req, res) => {
  const research_id = req.params.research_id;

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [results] = await connection.execute(
      'SELECT * FROM research WHERE id = ?',
      [research_id]
    );
    res.json(results[0]); // ส่งข้อมูล research แค่ 1 ตัว
  } catch (err) {
    console.error('Error fetching research:', err);
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// ดึงผลลัพธ์ที่บันทึกจาก Gemini API ตาม user_id
app.get('/summaries/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // เชื่อมต่อกับฐานข้อมูล
    const connection = await mysql.createConnection(dbConfig);

    const [results] = await connection.execute(
      'SELECT * FROM gemini WHERE user_id = ?',
      [userId]
    );

    // ส่งผลลัพธ์กลับไปยัง client
    res.json(results);

    // ปิดการเชื่อมต่อฐานข้อมูล
    await connection.end();
  } catch (err) {
    console.error('Error querying database:', err); // Log ข้อผิดพลาดที่เกิดขึ้น
    res.status(500).json({ error: 'Error fetching summaries from database' });
  }
});


app.get('/status', (req, res) => {
  res.json({ status: 'Server is running', uptime: process.uptime() });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
