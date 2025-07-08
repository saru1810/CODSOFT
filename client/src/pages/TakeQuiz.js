import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TakeQuiz.css';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`https://codsoft-yfqo.onrender.com/api/quiz/${id}`);
        const data = await res.json();
        if (res.ok) {
          setQuiz(data);
          setAnswers(Array(data.questions.length).fill(null));
        } else {
          setMsg('❌ Quiz not found');
        }
      } catch (err) {
        setMsg('❌ Failed to load quiz');
      }
    };
    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (index, selectedOption) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = selectedOption;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answers.includes(null)) {
      alert("❗ Please answer all questions before submitting.");
      return;
    }

    try {
      const res = await fetch(`https://codsoft-yfqo.onrender.com/api/quiz/submit/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (res.ok) {
        setScore(data.score);
        setMsg(`✅ You scored ${data.score} out of ${data.total}`);
      } else {
        setMsg(data.msg || '❌ Error submitting quiz');
      }
    } catch (err) {
      setMsg('❌ Submission failed');
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  const question = quiz.questions[currentQuestion];

  return (
    <div className="take-quiz-container">
      <h2 className="take-quiz-title">🧠 Take Quiz: {quiz.title}</h2>

      {msg && <p style={{ textAlign: 'center', color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</p>}

      {score === null ? (
        <form onSubmit={handleSubmit}>
          <div className="question-block">
            <div className="question-text">{question.question}</div>
            {question.options.map((opt, i) => (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`q-${currentQuestion}`}
                  value={i}
                  checked={answers[currentQuestion] === i}
                  onChange={() => handleAnswerChange(currentQuestion, i)}
                />
                {opt}
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {currentQuestion > 0 && (
              <button type="button" className="nav-button" onClick={handleBack}>
                ⬅️ Back
              </button>
            )}

            {currentQuestion < quiz.questions.length - 1 && (
              <button type="button" className="nav-button" onClick={handleNext}>
                Next ➡️
              </button>
            )}

            {currentQuestion === quiz.questions.length - 1 && (
              <button type="submit" className="submit-quiz-button">
                ✅ Submit Answers
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="score-result">
          🎉 You scored {score} out of {quiz.questions.length}
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
