const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        qInTitle: 'climate OR environment OR sustainability OR renewable OR wildlife OR pollution',
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 10,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const filteredArticles = response.data.articles.filter(
      (article) => article.urlToImage && article.description
    );

    res.status(200).json(filteredArticles.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch news', error: error.message });
  }
});

module.exports = router;