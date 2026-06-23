# EcoEducation 🌱
### Gamified Environmental Education Platform

A full-stack MERN web application that turns environmental education 
into an interactive, gamified experience — built from a college 
hackathon concept into a fully working production-style application.

**Live Demo:** [EcoEducation-demo.vercel.app](https://EcoEducation-demo.vercel.app)

---

## Features

- 🔐 **Secure Authentication** — Signup/Login with bcrypt password hashing
- 🎮 **Level-Based Quiz Engine** — Real-time feedback, explanations, 
  and anti-cheat logic to prevent duplicate submissions
- 🌍 **Live News Feed** — Real-time climate & environment news via 
  News API, proxied securely through the backend
- 🏆 **Leaderboard** — Real-time ranking using MongoDB sorted queries
- 🌙 **Dark/Light Mode** — UI preference saved via localStorage
- 📱 **Responsive Design** — Works on all screen sizes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Axios, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Security | bcrypt, environment variables (.env) |
| External API | NewsAPI.org |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure
EcoEducation/

├── backend/

│   ├── models/

│   │   ├── User.js          # User schema with bcrypt hooks

│   │   └── Quiz.js          # Quiz schema with explanation field

│   ├── routes/

│   │   ├── authRoutes.js    # Signup, Login APIs

│   │   ├── quizRoutes.js    # Quiz questions, Submit, My-attempts

│   │   ├── leaderboardRoutes.js

│   │   └── newsRoutes.js    # News API proxy

│   ├── scripts/

│   │   └── seedQuiz.js      # Bulk question seeder (OpenTDB)

│   └── server.js

└── frontend/

└── src/

├── pages/

│   ├── Home.jsx     # Landing page with news feed

│   ├── Login.jsx

│   ├── Signup.jsx

│   ├── Quiz.jsx     # Level-based quiz engine

│   └── Leaderboard.jsx

└── components/

├── Navbar.jsx   # Dynamic (changes on login/logout)

└── NotifyPopup.jsx

---

## Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier)
- NewsAPI.org account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/abhimanyucodes/EcoEducation.git
cd EcoEducation
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:
MONGODB_URI=your_mongodb_atlas_connection_string
NEWS_API_KEY=your_newsapi_key
PORT=5000

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## Key Technical Decisions

**Why backend proxy for News API?**  
API key stays server-side — never exposed to client (DevTools).

**Why bcrypt pre-save hook?**  
Password auto-hashes before any `.save()` call — no manual hashing needed in routes.

**Why `attemptedQuizzes` array?**  
Tracks both correct and incorrect attempts per user — prevents point farming even after wrong answers.

**Why `.select()` on leaderboard?**  
Only `name` and `ecoPoints` exposed — password hash and email never leak through public APIs.

---

## Screenshots

*(Add screenshots here after deployment)*

---

## Future Scope

- AI-personalized eco-learning journeys
- Carbon footprint tracker
- Pan-India inter-school Eco Championships
- Progressive Web App (PWA) support

---

## License

MIT License — feel free to use and modify.