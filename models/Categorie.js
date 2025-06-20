const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema({
  nom: { type: String, required: true },      
  description: { type: String },              
});

module.exports = mongoose.model('Categorie', categorieSchema);