// authServer.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./authApp'); // version qui n’écoute pas

const port = process.env.AUTH_PORT || 8001;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie (auth server)');
    app.listen(port, () => {
      console.log(`🔐 Auth server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB (auth server) :', err);
  });
