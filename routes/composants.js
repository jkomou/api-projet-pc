const express = require('express');
const router = express.Router();
const Composant = require('../models/Composant'); // Assure-toi que le chemin est correct
const auth = require('../authMiddleware'); // Middleware d'authentification (si utilisé)

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

// ✅ POST : ajout d’un composant
router.post('/', async (req, res) => {
  try {
    const nouveauComposant = new Composant(req.body);
    await nouveauComposant.save();
    res.status(201).json({ message: 'Composant ajouté', composant: nouveauComposant });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de l’ajout', erreur: err.message });
  }
});

// ✅ PUT : modification d’un composant
router.put('/:id', async (req, res) => {
  try {
    const updated = await Composant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Composant non trouvé' });
    res.json({ message: 'Composant mis à jour', composant: updated });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour', erreur: err.message });
  }
});

// ✅ DELETE : suppression d’un composant
router.delete('/:id', async (req, res) => {
  try {
    const supprimé = await Composant.findByIdAndDelete(req.params.id);
    if (!supprimé) return res.status(404).json({ message: 'Composant non trouvé' });
    res.json({ message: 'Composant supprimé', composant: supprimé });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
});

// 🔒 Exemple de route protégée (utilise un middleware d’auth)
router.post('/ajouter', auth, async (req, res) => {
  try {
    const composant = new Composant(req.body);
    await composant.save();
    res.json({ message: 'Composant ajouté avec succès !', composant });
  } catch (err) {
    res.status(400).json({ message: 'Erreur', erreur: err.message });
  }
});

module.exports = router;
