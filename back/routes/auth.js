require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const Utilisateur = require('../models/Utilisateur');
const Refresh = require('../models/Refresh'); // modèle refresh tokens

// Login : email + mot de passe
const secret = 'ton_secret_pour_jwt'; // à mettre dans un fichier .env sécurisé

router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  console.log('Mot de passe clair reçu:', mot_de_passe);  // <-- ici

  if (!email || !mot_de_passe) return res.status(400).json({ message: 'Email et mot_de_passe requis' });

  try {
    const utilisateur = await Utilisateur.findOne({ email });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    console.log('Utilisateur trouvé:', utilisateur);

    if (!utilisateur.mot_de_passe) {
      return res.status(500).json({ message: 'Mot de passe manquant pour cet utilisateur' });
    }

    const isMatch = await utilisateur.comparePassword(mot_de_passe);
    console.log('Mot de passe correspond:', isMatch); // <-- ici aussi

    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer token JWT (exemple simple)
    const payload = { id: utilisateur._id, nom: utilisateur.nom, email: utilisateur.email };
    const accessToken = jwt.sign(payload, 'ton_secret', { expiresIn: '1h' });

    res.json({
      accessToken,
      user: payload
    });

  } catch (err) {
    console.error('Erreur login:', err);
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

  // Validation basique des champs
  if (!nom || !email || !mot_de_passe) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    // Vérifier si email déjà utilisé
    const existant = await Utilisateur.findOne({ email });
    if (existant) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer et sauvegarder l'utilisateur
    const utilisateur = new Utilisateur({
      nom,
      email,
      mot_de_passe: hashedPassword,
      date_inscription: new Date()
    });

    await utilisateur.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
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
