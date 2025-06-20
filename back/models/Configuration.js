const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const configurationSchema = new Schema({
  utilisateur: { type: Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  nom_config: { type: String, required: true },
  composants: [{ type: Schema.Types.ObjectId, ref: 'Composant' }],
  date_creation: { type: Date, default: Date.now },
  commentaires: String
});

module.exports = mongoose.model('Configuration', configurationSchema);
