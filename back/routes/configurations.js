const express = require('express');
const router = express.Router();
const Configuration = require('../models/Configuration');
const { generatePdfFromConfig } = require('../utils/pdfGenerator'); // fonction à créer

const auth = require('../authMiddleware'); // middleware d'authentification unifié

// Lister configs de l'utilisateur connecté
router.get('/', auth, async (req, res) => {
  try {
    const configs = await Configuration.find({ utilisateur: req.user.id });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une nouvelle configuration
router.post('/', auth, async (req, res) => {
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

// Modifier une configuration
router.put('/:id', auth, async (req, res) => {
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

// Supprimer une configuration
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Configuration.deleteOne({ _id: req.params.id, utilisateur: req.user.id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Configuration non trouvée' });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: 'Erreur suppression configuration' });
  }
});

// Exporter config au format PDF
router.get('/:id/export', auth, async (req, res) => {
  try {
    const config = await Configuration.findOne({ _id: req.params.id, utilisateur: req.user.id }).populate('composants');
    if (!config) return res.status(404).json({ message: 'Configuration non trouvée' });

    const pdfBuffer = await generatePdfFromConfig(config);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="configuration_${req.params.id}.pdf"`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: 'Erreur génération PDF' });
  }
});

module.exports = router;
