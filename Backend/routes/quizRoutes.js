const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');


router.get('/questions', async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/submit', async (req, res) => {
  try {
    const { userId, quizId, selectedAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const user = await User.findById(userId);

    const existingAttempt = user.attemptedQuizzes.find(
      (a) => a.quizId.toString() === quizId
    );

    if (existingAttempt) {
      return res.status(200).json({
        alreadyAttempted: true,
        isCorrect: existingAttempt.isCorrect,
        selectedAnswer: existingAttempt.selectedAnswer,
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
        totalPoints: user.ecoPoints
      });
    }

    const isCorrect = quiz.correctAnswer === selectedAnswer;

    if (isCorrect) {
      user.ecoPoints += quiz.points;
    }

    user.attemptedQuizzes.push({ quizId, selectedAnswer, isCorrect });
    await user.save();

    res.status(200).json({
      alreadyAttempted: false,
      isCorrect,
      selectedAnswer,
      correctAnswer: quiz.correctAnswer,
      explanation: quiz.explanation,
      pointsEarned: isCorrect ? quiz.points : 0,
      totalPoints: user.ecoPoints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/my-attempts/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.attemptedQuizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/add', async (req, res) => {
  try {
    const { question, options, correctAnswer, points } = req.body;
    const newQuiz = new Quiz({ question, options, correctAnswer, points });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz added successfully', quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;