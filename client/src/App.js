import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import QuizList from './pages/QuizList';
import Navbar from './components/Navbar'; // ✅ Navbar to be shown on all pages

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Navbar stays on all routes */}
      <Routes>
        <Route path="/login" element={<Login />} />         {/* 🔐 Login page */}
        <Route path="/register" element={<Register />} />   {/* 📝 Register page */}
        <Route path="/" element={<QuizList />} />           {/* 🏠 Home - quiz list */}
        <Route path="/create-quiz" element={<CreateQuiz />} /> {/* ➕ Create quiz */}
        <Route path="/quiz/:id" element={<TakeQuiz />} />   {/* 🧠 Take quiz by ID */}
      </Routes>
    </Router>
  );
}

export default App;
