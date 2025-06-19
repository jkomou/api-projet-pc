const mongoose = require('mongoose');

const partenaireSchema = new mongoose.Schema({
  id: String,
  nom: String,
  url: String,
  commission: Number,
  conditions: String,
});

module.exports = mongoose.model('Partenaire', partenaireSchema);