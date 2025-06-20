const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Vérifie la présence du token dans l'en-tête Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Accès non autorisé - token manquant' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Vérifie et décode le token JWT avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajoute les infos utilisateur décodées à la requête pour utilisation dans les routes
    req.user = decoded;

    next();
  } catch (err) {
    // En cas d’erreur (token invalide, expiré, etc), renvoie un statut 401
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

module.exports = authMiddleware;
