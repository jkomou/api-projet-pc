const express = require('express');
const router = express.Router();
const Partenaire = require('../models/Partenaire');
const Prix = require('../models/Prix'); // modèle pour stocker prix partenaires par composant
const auth = require('../authMiddleware'); // Import du middleware auth

// Lister tous les partenaires (publique)
router.get('/', async (req, res) => {
  try {
    const partenaires = await Partenaire.find();
    res.json(partenaires);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Lister les prix pour un composant (publique)
router.get('/:composantId/prix', async (req, res) => {
  try {
    const prix = await Prix.find({ composant: req.params.composantId }).populate('partenaire');
    res.json(prix);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un partenaire (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const partenaire = new Partenaire(req.body);
    await partenaire.save();
    res.status(201).json(partenaire);
  } catch (err) {
    res.status(400).json({ message: 'Erreur', erreur: err.message });
  }
});

// Modifier partenaire (protégé)
router.put('/:id', auth, async (req, res) => {
  // TODO: ajouter vérification admin si nécessaire
  try {
    const partenaire = await Partenaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!partenaire) return res.status(404).json({ message: 'Partenaire non trouvé' });
    res.json(partenaire);
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour partenaire' });
  }
});

// Supprimer partenaire (protégé)
router.delete('/:id', auth, async (req, res) => {
  // TODO: ajouter vérification admin si nécessaire
  try {
    await Partenaire.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: 'Erreur suppression partenaire' });
  }
});

// Ajouter ou mettre à jour un prix d’un composant par un partenaire (protégé)
router.post('/:partenaireId/prix/:composantId', auth, async (req, res) => {
  // TODO: ajouter vérification admin si nécessaire
  try {
    const { prix } = req.body;
    let prixDoc = await Prix.findOne({ partenaire: req.params.partenaireId, composant: req.params.composantId });
    if (prixDoc) {
      prixDoc.prix = prix;
      await prixDoc.save();
    } else {
      prixDoc = new Prix({ partenaire: req.params.partenaireId, composant: req.params.composantId, prix });
      await prixDoc.save();
    }
    res.json(prixDoc);
  } catch (err) {
    res.status(400).json({ message: 'Erreur ajout/mise à jour prix' });
  }
});

// Supprimer prix (protégé)
router.delete('/:partenaireId/prix/:composantId', auth, async (req, res) => {
  // TODO: ajouter vérification admin si nécessaire
  try {
    await Prix.deleteOne({ partenaire: req.params.partenaireId, composant: req.params.composantId });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ message: 'Erreur suppression prix' });
  }
});

module.exports = router;
