const express = require('express');
const router = express.Router();
const Composant = require('../models/Composant');
const auth = require('../authMiddleware');

// ✅ GET : liste de tous les composants avec filtres
router.get('/', async (req, res) => {
  try {
    const { categorie, marque } = req.query;
    let filtre = {};
    if (categorie) filtre.categorie_id = categorie;
    if (marque) filtre.marque = marque;

    const composants = await Composant.find(filtre);
    res.json(composants);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
});

// ✅ POST : ajout d’un composant (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const nouveauComposant = new Composant(req.body);
    await nouveauComposant.save();
    res.status(201).json({ message: 'Composant ajouté', composant: nouveauComposant });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de l’ajout', erreur: err.message });
  }
});

// ✅ PUT : modification d’un composant (protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Composant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Composant non trouvé' });
    res.json({ message: 'Composant mis à jour', composant: updated });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', erreur: err.message });
  }
});

// ✅ DELETE : suppression d’un composant (protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const supprimé = await Composant.findByIdAndDelete(req.params.id);
    if (!supprimé) return res.status(404).json({ message: 'Composant non trouvé' });
    res.json({ message: 'Composant supprimé', composant: supprimé });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
});

module.exports = router;
