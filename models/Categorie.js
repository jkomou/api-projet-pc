const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  id: String,
  nom: String,
});

module.exports = mongoose.model('Categorie', categorieSchema);