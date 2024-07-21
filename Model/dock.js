const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 5000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your React app URL
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// POST endpoint to receive data from React app
app.post('/sendData', async (req, res) => {
  const { data } = req.body;

  // Path to your Python executable and script
  const pythonExecutable = 'C:/Users/ADMIN/AppData/Local/Programs/Python/Python39/python.exe';
  const pythonScriptPath = 'D:/Finalproject101/Backend/pyshell.py';

  try {
    // Spawn a child process to run the Python script
    const pythonProcess = spawn(pythonExecutable, [pythonScriptPath]);

    let responseData = ''; // Variable to accumulate data from Python process

    // Handle input to the Python script
    pythonProcess.stdin.write(data);
    pythonProcess.stdin.end();

    // Handle output from the Python script
    pythonProcess.stdout.on('data', (data) => {
      responseData += data.toString(); // Append data to responseData
    });

    // Handle errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error in Python script: ${data}`);
      res.status(500).send('Error communicating with Python script');
    });

    // When Python process finishes
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.send(responseData); // Send accumulated data back to React
      } else {
        console.error(`Python process exited with code ${code}`);
        res.status(500).send('Python process exited with an error');
      }
    });
  } catch (error) {
    console.error('Error spawning Python process:', error);
    res.status(500).send('Error communicating with Python script');
  }
});

// GET endpoint to check server status
app.get('/', (req, res) => {
  res.send('Server is running normally.');
});

// Start the server
app.listen(port, () => {
  console.log(`Node.js server is running on http://localhost:${port}`);
});
