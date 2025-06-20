// index.js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 8000;
const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connexion MongoDB réussie');

  app.listen(port, () => {
    console.log(`🚀 Server app listening on port ${port}`);
  });
})
.catch((err) => {
  console.error('❌ Erreur MongoDB :', err);
});
