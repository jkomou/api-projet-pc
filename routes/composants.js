const express = require('express');
const router = express.Router();
const component = require('components');
const auth = require('../authMiddleware'); // ✅ chemin mis à jour

// GET : liste de tous les composants avec filtres
router.get('/', (req, res) => {
    const { categorie, marque } = req.query;
    let resultats = composants;
  
    if (categorie) resultats = resultats.filter(c => c.categorie_id === categorie);
    if (marque) resultats = resultats.filter(c => c.marque === marque);
  
    res.json(resultats);
  });
  
  // POST : ajout d’un composant
  router.post('/', (req, res) => {
    const nouveauComposant = req.body;
    composants.push(nouveauComposant);
    res.status(201).json({ message: 'Composant ajouté', composant: nouveauComposant });
  });
  
  // PUT : modification d’un composant
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = composants.findIndex(c => c.id === id);
  
    if (index === -1) return res.status(404).json({ message: 'Composant non trouvé' });
  
    composants[index] = { ...composants[index], ...req.body };
    res.json({ message: 'Composant mis à jour', composant: composants[index] });
  });
  
  // DELETE : suppression d’un composant
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = composants.findIndex(c => c.id === id);
  
    if (index === -1) return res.status(404).json({ message: 'Composant non trouvé' });
  
    const supprimé = composants.splice(index, 1);
    res.json({ message: 'Composant supprimé', composant: supprimé[0] });
  });

// Exemple de route protégée
router.post('/ajouter', auth, (req, res) => {
  res.json({ message: 'Composant ajouté avec succès !' });
});

module.exports = router;

