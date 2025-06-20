const express = require('express');
const jwt = require('jsonwebtoken');
const router = require('./auth'); // ton routeur d’auth (login, token...)

const app = express();
app.use(express.json());

app.use('/', router);

app.listen(800, () => {
  console.log('Auth server running on port 800');
});