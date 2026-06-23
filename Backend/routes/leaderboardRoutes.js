const express = require('express');
const router = express.Router();
const User = require('../models/User');


router.get('/', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ ecoPoints: -1 })
      .select('name ecoPoints');

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;