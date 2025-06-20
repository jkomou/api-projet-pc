const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

router.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken });
});

module.exports = router;
