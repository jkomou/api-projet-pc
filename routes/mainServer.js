const express = require('express');
const router = require('./main'); // routes principales (posts, etc.)

const app = express();
app.use(express.json());

app.use('/', router);

app.listen(801, () => {
  console.log('Main server running on port 801');
});
