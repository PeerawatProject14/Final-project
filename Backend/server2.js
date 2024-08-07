const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 5001;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.post('/sendDataToScript2', async (req, res) => {
  const { data } = req.body;

  console.log('Received data from React:', data);

  const pythonExecutable = 'C:/Users/admin/AppData/Local/Programs/Python/Python39/python.exe';
  const pythonScriptPath = 'C:/Users/admin/OneDrive/เอกสาร/GitHub/Final-project/Backend/gemini.py';

  try {
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath, data]);

    let responseData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      responseData += data.toString('utf-8');
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString('utf-8');
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python script executed successfully:', responseData);
        res.send(responseData);
      } else {
        console.error(`Python script exited with code ${code}: ${errorData}`);
        res.status(500).send(`Python script error: ${errorData}`);
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python script:', err);
      res.status(500).send('Failed to start Python script');
    });

  } catch (error) {
    console.error('Error communicating with Python script:', error);
    res.status(500).send('Error communicating with Python script');
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Node.js server is running at http://localhost:${port}`);
});
