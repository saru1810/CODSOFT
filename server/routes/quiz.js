const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// ✅ GET all quizzes
router.get('/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('_id title');
    console.log("📤 Sending quizzes:", quizzes);
    res.json(quizzes);
  } catch (err) {
    console.error("❌ Error getting quizzes:", err.message);
    res.status(500).json({ msg: 'Failed to load quizzes', error: err.message });
  }
});

// ✅ CREATE a new quiz
router.post('/create', async (req, res) => {
  console.log("✅ Quiz creation API hit");
  console.log("📦 Body Received:", req.body);

  try {
    const { title, questions } = req.body;

    // 🔒 Basic validation
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: "❌ Title or questions missing or invalid" });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.question ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctAnswer !== 'number'
      ) {
        return res.status(400).json({ msg: `❌ Invalid data in question ${i + 1}` });
      }
    }

    const newQuiz = new Quiz({ title, questions });

    await newQuiz.save();
    console.log("✅ Quiz saved:", newQuiz);
    res.status(201).json({ msg: 'Quiz created successfully', quiz: newQuiz });

  } catch (err) {
    console.error("❌ Backend Error:", err.message);
    console.error("🔍 Full error:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ GET quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    console.error("❌ Error getting quiz by ID:", err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ SUBMIT quiz answers
router.post('/submit/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) score++;
    });

    res.json({ msg: 'Quiz submitted', score, total: quiz.questions.length });
  } catch (err) {
    console.error("❌ Error submitting quiz:", err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// ✅ DELETE quiz
router.delete('/delete/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    res.json({ msg: 'Quiz deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting quiz:", err.message);
    res.status(500).json({ msg: 'Failed to delete quiz', error: err.message });
  }
});

module.exports = router;
