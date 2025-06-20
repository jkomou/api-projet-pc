const express = require('express');
const router = express.Router();

const Configuration = require('../models/Configuration');
const auth = require('../authMiddleware'); // middleware d'authentification unifié

router.get('/', auth, async (req, res) => {
  const users = await Utilisateur.find(); // ou ce que tu veux afficher
  res.json(users);
});


// Lister toutes les configurations de l'utilisateur connecté
router.get('/configurations', auth, async (req, res) => {
  try {
    const configs = await Configuration.find({ utilisateur: req.user.id });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une nouvelle configuration pour l'utilisateur connecté
router.post('/configurations', auth, async (req, res) => {
  try {
    const config = new Configuration({
      ...req.body,
      utilisateur: req.user.id,
      date_creation: new Date()
    });
    await config.save();
    res.status(201).json(config);
  } catch (err) {
    res.status(400).json({ message: 'Erreur création configuration' });
  }
});

// Modifier une configuration spécifique (appartient à l'utilisateur)
router.put('/configurations/:id', auth, async (req, res) => {
  try {
    const config = await Configuration.findOneAndUpdate(
      { _id: req.params.id, utilisateur: req.user.id },
      req.body,
      { new: true }
    );
    if (!config) return res.status(404).json({ message: 'Configuration non trouvée' });
    res.json(config);
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour configuration' });
  }
});

// Supprimer une configuration spécifique (appartient à l'utilisateur)
router.delete('/configurations/:id', auth, async (req, res) => {
  try {
    const result = await Configuration.deleteOne({ _id: req.params.id, utilisateur: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Configuration non trouvée' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: 'Erreur suppression configuration' });
  }
});

module.exports = router;
