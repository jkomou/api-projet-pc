const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  const { nom, email, motDePasse } = req.body;

  const hashedPassword = await bcrypt.hash(motDePasse, 10);
  const newUser = new User({ nom, email, motDePasse: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur enregistré !' });
  } catch (err) {
    res.status(400).json({ error: 'Erreur lors de l’enregistrement.' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, motDePasse } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const valid = await bcrypt.compare(motDePasse, user.motDePasse);
  if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '2h',
  });

  res.json({ message: 'Connexion réussie', token });
});

module.exports = router;