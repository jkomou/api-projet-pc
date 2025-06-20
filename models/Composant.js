const mongoose = require('mongoose');

const composantSchema = new mongoose.Schema({
  categorie_id: { type: String, required: true },
  marque: { type: String, required: true },
  nom: { type: String, required: true },
  prix: { type: Number, required: true },
  specs: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Composant', composantSchema);