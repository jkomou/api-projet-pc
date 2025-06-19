const mongoose = require('mongoose');

const composantSchema = new mongoose.Schema({
  id: String,
  categorie_id: String,
  marque: String,
  nom: String,
  prix: Number,
  specs: mongoose.Schema.Types.Mixed // autorise tout type de structure ici
});

module.exports = mongoose.model('Composant', composantSchema);