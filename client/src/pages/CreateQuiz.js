import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateQuiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate(); // ✅ useNavigate inside the component

  // 🔒 Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to create a quiz");
      navigate('/login');
    }
  }, [navigate]);

  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
  ]);
  const [msg, setMsg] = useState('');

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: '' },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('📤 Submitting Quiz:', { title, questions });

    const res = await fetch('https://codsoft-yfqo.onrender.com/api/quiz/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Send token with request
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, questions }),
    });

    const data = await res.json();
    console.log('📥 Response:', data);

    if (res.ok) {
      setMsg('✅ Quiz created successfully!');
      setTitle('');
      setQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } else {
      setMsg(data.msg || '❌ Error creating quiz');
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-title">📝 Create a New Quiz</h2>

      {msg && <p style={{ color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, index) => (
          <div key={index} className="question-box">
            <div className="input-group">
              <label>Question {index + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                required
              />
            </div>

            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="input-group">
                <label>Option {optIndex + 1}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                  required
                />
              </div>
            ))}

            <div className="input-group">
              <label>Correct Answer (0 to 3)</label>
              <input
                type="number"
                min="0"
                max="3"
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswer(index, Number(e.target.value))}
                required
              />
            </div>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="add-button">
          ➕ Add Question
        </button>

        <button type="submit" className="submit-button">
          ✅ Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
