const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware'); // réutilise ton middleware auth centralisé
const Utilisateur = require('../models/Utilisateur');

// Plus besoin de redéfinir authenticateToken ici, on utilise authMiddleware

router.get('/posts', auth, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findOne({ email: req.user.email });
    if (!utilisateur) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(utilisateur);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
