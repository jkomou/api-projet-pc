const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const posts = [
  { username: 'Kyle', title: 'Test 1' },
  { username: 'max@yahoo.fr', title: 'Test 2' }
];

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter(post => post.username === req.user.name));
});

module.exports = router;
