import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage'; 
import ResearchData from './components/ResearchData';
import BookmarkPage from './components/Bookmark';
import ResearchDetail from './components/ResearchData';
import CompareResults from './components/CompareResults';
import UserResearch from './components/UserResearch';
import UserResearchDetail from './components/UserResearchDetail'; // ต้อง import UserResearchDetail ที่จะนำไปใช้

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/research" element={<ResearchData />} />
        <Route path="/bookmark" element={<BookmarkPage />} />
        <Route path="/research/:research_id" element={<ResearchDetail />} />
        <Route path="/compare" element={<CompareResults />} />
        <Route path="/UserResearch" element={<UserResearch />} />
        <Route path="/user-research/:research_id" element={<UserResearchDetail />} /> {/* เพิ่มเส้นทางสำหรับ UserResearchDetail */}
      </Routes>
    </Router>
  );
}

export default App;
