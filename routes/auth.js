require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const Utilisateur = require('../models/Utilisateur');
const Refresh = require('../models/Refresh'); // modèle refresh tokens

// Login : email + mot de passe
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const userPayload = { id: utilisateur._id, email: utilisateur.email };
    const accessToken = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(userPayload, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' });

    await Refresh.create({ token: refreshToken, user: utilisateur._id });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error('Erreur lors du login :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Rafraîchir un token
router.post('/token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  const tokenEnBase = await Refresh.findOne({ token });
  if (!tokenEnBase) return res.sendStatus(403);

  jwt.verify(token, process.env.REFRESH_JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const payload = { email: user.email, id: user.id };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  });
});

// Inscription
router.post('/signup', async (req, res) => {
  const { nom, email, mot_de_passe } = req.body;

  try {
    const existant = await Utilisateur.findOne({ email });
    if (existant) return res.status(400).json({ message: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const utilisateur = new Utilisateur({
      nom,
      email,
      mot_de_passe: hashedPassword,
      date_inscription: new Date()
    });

    await utilisateur.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(400);

  await Refresh.deleteOne({ token });
  res.sendStatus(204);
});

module.exports = router;
