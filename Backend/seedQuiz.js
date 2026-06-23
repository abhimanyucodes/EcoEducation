require('dotenv').config({ quiet: true });
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const axios = require('axios');
const Quiz = require('./models/Quiz');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB, fetching questions...');

    try {
      const response = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: 15,
          category: 17, 
          type: 'multiple'
        }
      });

      const questions = response.data.results.map((q) => {
        const options = [...q.incorrect_answers, q.correct_answer];
        
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        return {
          question: decodeHTML(q.question),
          options: options.map(decodeHTML),
          correctAnswer: decodeHTML(q.correct_answer),
          points: q.difficulty === 'hard' ? 20 : q.difficulty === 'medium' ? 15 : 10,
          explanation: `The correct answer is "${decodeHTML(q.correct_answer)}".`
        };
      });

      await Quiz.insertMany(questions);
      console.log(`${questions.length} questions added successfully!`);
    } catch (error) {
      console.error('Error fetching/adding questions:', error.message);
    }

    mongoose.connection.close();
  })
  .catch((err) => console.log('MongoDB Connection Error', err));


function decodeHTML(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&eacute;/g, 'é')
    .replace(/&ouml;/g, 'ö');
}