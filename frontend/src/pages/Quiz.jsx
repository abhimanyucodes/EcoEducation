import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './Quiz.css';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    Promise.all([
      axios.get('http://localhost:5000/api/quiz/questions'),
      axios.get(`http://localhost:5000/api/quiz/my-attempts/${parsedUser.id}`)
    ]).then(([questionsRes, attemptsRes]) => {
      setQuestions(questionsRes.data);

      const attemptsMap = {};
      const attemptsList = attemptsRes.data || [];
      attemptsList.forEach((a) => {
        attemptsMap[a.quizId] = {
          selectedAnswer: a.selectedAnswer,
          isCorrect: a.isCorrect
        };
      });
      setAttempts(attemptsMap);

      const allSolved = questionsRes.data.every((q) => attemptsMap[q._id]);
      if (allSolved && questionsRes.data.length > 0) {
        setCurrentLevel(questionsRes.data.length);
      } else {
        const firstUnsolvedIndex = questionsRes.data.findIndex((q) => !attemptsMap[q._id]);
        setCurrentLevel(firstUnsolvedIndex === -1 ? 0 : firstUnsolvedIndex);
      }

      setLoading(false);
    }).catch((error) => {
      console.error('Quiz loading error:', error);
      setLoading(false);
    });
  }, []);

  const handleAnswer = async (quiz, selectedAnswer) => {
    if (attempts[quiz._id]) return;

    try {
      const response = await axios.post('http://localhost:5000/api/quiz/submit', {
        userId: user.id,
        quizId: quiz._id,
        selectedAnswer
      });

      setAttempts((prev) => ({
        ...prev,
        [quiz._id]: {
          selectedAnswer: response.data.selectedAnswer,
          isCorrect: response.data.isCorrect,
          explanation: response.data.explanation,
          correctAnswer: response.data.correctAnswer
        }
      }));

      if (response.data.isCorrect) {
        const updatedUser = { ...user, ecoPoints: response.data.totalPoints };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goToNext = () => {
    const q = questions[currentLevel];
    if (!attempts[q._id]) {
      alert('Please answer the question before moving to the next level!');
      return;
    }
    setCurrentLevel((prev) => prev + 1);
  };

  const goToPrevious = () => {
    if (currentLevel > 0) {
      setCurrentLevel((prev) => prev - 1);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Please log in first.</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading quiz...</p>
        </div>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>No quiz questions available right now.</p>
        </div>
      </>
    );
  }

  if (currentLevel >= questions.length) {
    const totalCorrect = Object.values(attempts).filter((a) => a.isCorrect).length;

    return (
      <>
        <Navbar />
        <div className="container completion-screen">
          <h2>🎉 Section Completed!</h2>
          <p>You've answered all {questions.length} questions.</p>
          <p>Correct: {totalCorrect} / {questions.length}</p>
          <p>Total Eco Points: {user.ecoPoints}</p>
          <p className="coming-soon">🚀 New question sets coming soon — keep checking back!</p>
          <button className="nav-btn nav-btn-primary" onClick={() => setCurrentLevel(0)}>
            Review Questions
          </button>
        </div>
      </>
    );
  }

  const totalSolved = Object.keys(attempts).length;
  const progressPercent = (totalSolved / questions.length) * 100;
  const q = questions[currentLevel];
  const attempt = attempts[q._id];

  return (
    <>
      <Navbar />
      <div className="container quiz-container">
        <div className="quiz-header">
          <h2>EcoEducation Quiz 🌱</h2>
          <p className="points-display">Your Points: {user.ecoPoints}</p>
        </div>

        <div className="progress-wrapper">
          <div className="progress-label">
            Level {currentLevel + 1} of {questions.length} &nbsp;•&nbsp; {totalSolved} Completed
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="quiz-question single-question">
          <span className="level-badge">Level {currentLevel + 1}</span>
          <h4>{q.question}</h4>

          {q.options.map((option, i) => {
            let btnClass = 'quiz-option';

            if (attempt) {
              if (option === attempt.selectedAnswer) {
                btnClass += attempt.isCorrect ? ' option-correct' : ' option-wrong';
              } else if (!attempt.isCorrect && option === attempt.correctAnswer) {
                btnClass += ' option-correct-hint';
              } else {
                btnClass += ' option-disabled';
              }
            }

            return (
              <button
                key={i}
                className={btnClass}
                onClick={() => handleAnswer(q, option)}
                disabled={!!attempt}
              >
                {option}
              </button>
            );
          })}

          {attempt && (
            <div className={`feedback-box ${attempt.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              {attempt.isCorrect ? 'Correct!' : 'Wrong.'} {attempt.explanation}
            </div>
          )}

          {!attempt && <p className="answer-hint">Select an answer to continue</p>}
        </div>

        <div className="quiz-nav">
          <button className="nav-btn" onClick={goToPrevious} disabled={currentLevel === 0}>
            ← Previous
          </button>
          <button className="nav-btn nav-btn-primary" onClick={goToNext}>
            {currentLevel === questions.length - 1 ? 'Finish →' : 'Next Level →'}
          </button>
        </div>
      </div>
    </>
  );
}

export default Quiz;