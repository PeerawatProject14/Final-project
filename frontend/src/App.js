import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage'; 
import ResearchData from './components/ResearchData';
import BookmarkPage from './components/Bookmark';
import ResearchDetail from './components/ResearchData';
import CompareResults from './components/CompareResults';

function App() {
  return (
    <Router>
      <Routes> {/* เปลี่ยนจาก Switch เป็น Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/research" element={<ResearchData />} />
        <Route path="/bookmark" element={<BookmarkPage />} />
        <Route path="/research/:research_id" element={<ResearchDetail />} />
        <Route path="/compare" element={<CompareResults />} />
      </Routes>
    </Router>
  );
}

export default App;
