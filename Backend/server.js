const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const crypto = require('crypto'); // ใช้สำหรับเข้ารหัสรหัสผ่านด้วย PBKDF2

const app = express();
const port = 5000;

app.use(express.json()); // เพิ่ม middleware เพื่อให้สามารถรับ JSON body ได้

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'research_db',
};

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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

app.get('/status', (req, res) => {
  res.json({ status: 'Server is running', uptime: process.uptime() });
});

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

// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
