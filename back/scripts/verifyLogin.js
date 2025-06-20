require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Utilisateur = require('../models/Utilisateur');

async function verifierLogin(email, motDePasseEnClair) {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const user = await Utilisateur.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé');
      process.exit(1);
    }

    const match = await bcrypt.compare(motDePasseEnClair, user.mot_de_passe);
    if (match) {
      console.log('Mot de passe valide !');
    } else {
      console.log('Mot de passe incorrect.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la vérification :', err);
    process.exit(1);
  }
}

// Remplace ici par un email et mot de passe que tu as dans ta base (en clair)
verifierLogin('alice.dupont@example.com', 'motdepasse1');