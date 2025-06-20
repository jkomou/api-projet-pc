const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const prixSchema = new Schema({
  partenaire: { type: Schema.Types.ObjectId, ref: 'Partenaire', required: true },
  composant: { type: Schema.Types.ObjectId, ref: 'Composant', required: true },
  prix: { type: Number, required: true },
  date_maj: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prix', prixSchema);
