// mainServer.js
require('dotenv').config(); // charge .env
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie');
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err);
  });
