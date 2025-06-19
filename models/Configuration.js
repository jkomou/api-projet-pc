const mongoose = require('mongoose');

// Configuration.js
const configurationSchema = new mongoose.Schema({
  utilisateur_id: { type: String, required: true },
  date_creation: { type: Date, default: Date.now },
  composants: [{ type: String, required: true }], // ✅ Juste des ID de composants comme 'cpu1'
  cout_total: Number,
});

module.exports = mongoose.model('Configuration', configurationSchema);
