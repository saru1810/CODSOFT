import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const res = await fetch('https://codsoft-yfqo.onrender.com/api/quiz/list');
        const data = await res.json();
        console.log("📦 Quiz list response:", data);
        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setMsg("❌ Invalid data received from server");
        }
      } catch (err) {
        setMsg('❌ Failed to load quizzes');
      }
    };

    fetchQuizzes();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const res = await fetch(`https://codsoft-yfqo.onrender.com/api/quiz/delete/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      alert(data.msg);
      setQuizzes(quizzes.filter(q => q._id !== id));
    } catch (err) {
      alert('❌ Failed to delete quiz');
    }
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">📋 Available Quizzes</h2>

      <div className="button-container">
        <Link to="/create-quiz">
          <button className="create-button">➕ Create New Quiz</button>
        </Link>
      </div>

      {msg && <p className="message">{msg}</p>}
      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-title-text">{quiz.title}</div>
              <div className="quiz-actions">
                <Link to={`/quiz/${quiz._id}`}>
                  <button className="take-button">Take Quiz</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(quiz._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
