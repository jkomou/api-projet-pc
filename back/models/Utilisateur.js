const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const utilisateurSchema = new mongoose.Schema({
  nom: String,
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  date_inscription: { type: Date, default: Date.now }
});

utilisateurSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
  } catch (err) {
    next(err);
  }
});

utilisateurSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('Comparing password:', candidatePassword, 'with hash:', this.mot_de_passe);
  if (!candidatePassword || !this.mot_de_passe) {
    throw new Error('Mot de passe ou hash manquant');
  }
  return bcrypt.compare(candidatePassword, this.mot_de_passe);
};

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
