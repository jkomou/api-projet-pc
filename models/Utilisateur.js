const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  id: String,
  nom: String,
  email: String,
  mot_de_passe: String,
  date_inscription: Date,
});

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
