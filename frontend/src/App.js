import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // เปลี่ยน Switch เป็น Routes
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage'; // import หน้า Homepage
import ResearchData from './components/ResearchData';

function App() {
  return (
    <Router>
      <Routes> {/* เปลี่ยนจาก Switch เป็น Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/research" element={<ResearchData />} />
      </Routes>
    </Router>
  );
}

export default App;
