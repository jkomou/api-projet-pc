const mongoose = require('mongoose');

const partenaireSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  contact: {
    email: String,
    telephone: String,
    site_web: String
  },
  adresse: String,
  date_creation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Partenaire', partenaireSchema);
