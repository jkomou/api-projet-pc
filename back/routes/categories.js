const express = require('express');
const router = express.Router();
const Categorie = require('../models/Categorie');

// GET : liste toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
});

module.exports = router;
