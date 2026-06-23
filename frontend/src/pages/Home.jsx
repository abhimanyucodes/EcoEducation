import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NotifyPopup from '../components/NotifyPopup';
import './Home.css';

const slides = [
  '/assets/image_1.avif',
  '/assets/image_2.jpg',
  '/assets/image_3.jpg',
  '/assets/image_4.jpg',
  '/assets/image_5.jpg'
];

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get('https://ecoeducation-backend.onrender.com/api/news')
      .then((response) => {
        setNews(response.data);
        setNewsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setNewsLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <>
      <NotifyPopup />
      <Navbar />

      <div className="main">
        <div className="left-side">
          <div className="slideshow">
            {slides.map((src, index) => (
              <img
                key={index}
                src={src}
                className={index === currentSlide ? 'active' : ''}
                alt={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="right-side">
          <div className="news-title">Latest News</div>

          {newsLoading && <p>Loading news...</p>}

          {!newsLoading && news.length === 0 && <p>Unable to load news right now.</p>}

          {news.map((article, index) => {
  return (
    <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="news-item">
      {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="news-img" />}
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <span className="news-date">{formatDate(article.publishedAt)} • {article.source.name}</span>
    </a>
  );
})}
        </div>
      </div>

      <div className="about" id="about_us">
        <div className="about_eco">
          <h2>
             About <span>EcoEducation</span>
          </h2>
        </div>
        <p>
          At <strong>EcoEducation</strong>, we believe that learning about the environment should be more
          than just reading textbooks — it should be an engaging, interactive, and life-changing experience.
        </p>
        <p>
          Despite the growing urgency of climate change and environmental degradation, students are often
          taught theory without real-world application. Our platform bridges this gap by combining
          education, gamification, and action.
        </p>

        <div className="about-card">
          <h3>Our Mission</h3>
          <p>
            To inspire students and young minds to take responsibility for the planet by making
            environmental education fun, practical, and impactful.
          </p>
        </div>

        <div className="about-card">
          <h3>🌱 What We Do</h3>
          <ul>
            <li>
              <strong>Interactive Lessons &amp; Quizzes</strong> → Learn about climate change,
              biodiversity, pollution, and sustainable living in a fun way.
            </li>
            <li>
              <strong>Eco Challenges &amp; Real-World Tasks</strong> → Activities like tree planting,
              waste segregation, and energy saving.
            </li>
            <li>
              <strong>Earn Eco-Points &amp; Rewards</strong> → Every action contributes to growth and
              community sustainability.
            </li>
            <li>
              <strong>Competitions &amp; Leaderboards</strong> → Schools and colleges showcase their
              commitment towards sustainability.
            </li>
          </ul>
        </div>

        <div className="about-card">
          <h3>Why It Matters</h3>
          <p>
            Environmental issues are no longer distant problems — they affect our air, water, food, and
            health every single day.
          </p>
        </div>
      </div>

      <footer className="footer" id="contact_us">
        <div className="footer-top">
          <div className="footer-col">
            <h3>EcoEducation</h3>
            <p>
              Making environmental education fun, interactive, and impactful. Together we build a
              sustainable future
            </p>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#">Eco-Friendly Tips</a>
              </li>
              <li>
                <a href="#">Student Challenges</a>
              </li>
              <li>
                <a href="#">Leaderboard</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>Email: eco.education.contact@gmail.com</p>
            
            <p>Address: India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 EcoEducation. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;