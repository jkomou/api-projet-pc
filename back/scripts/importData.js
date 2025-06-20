// --- Modules requis 
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const fs = require('fs');
const bcrypt = require('bcrypt');

// --- Connexion à la base MongoDB
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB :', err);
    process.exit(1);
  });

// --- Import des modèles Mongoose
const Utilisateur = require('../models/Utilisateur');
const Partenaire = require('../models/Partenaire');
const Composant = require('../models/Composant');
const Configuration = require('../models/Configuration');

// --- Lecture des fichiers JSON
const utilisateursData = JSON.parse(fs.readFileSync(`${__dirname}/../data/utilisateurs.json`, 'utf-8'));
const partenairesData = JSON.parse(fs.readFileSync(`${__dirname}/../data/partenaires.json`, 'utf-8'));
const composantsData = JSON.parse(fs.readFileSync(`${__dirname}/../data/components.json`, 'utf-8'));
const configurationsData = JSON.parse(fs.readFileSync(`${__dirname}/../data/configurations.json`, 'utf-8'));

// --- Fonction principale d'importation
const importerDonnees = async () => {
  try {
    // --- Suppression des anciennes données
    await Utilisateur.deleteMany();
    await Partenaire.deleteMany();
    await Composant.deleteMany();
    await Configuration.deleteMany();

    // --- Insertion des utilisateurs avec hash des mots de passe
    const utilisateursHashed = await Promise.all(
      utilisateursData.map(async (u) => {
        const hash = await bcrypt.hash(u.mot_de_passe, 10);
        return {
          nom: u.nom,
          email: u.email,
          mot_de_passe: hash
        };
      })
    );
    // On récupère les documents insérés avec leurs _id générés par MongoDB
    const utilisateurs = await Utilisateur.insertMany(utilisateursHashed);
    console.log('✅ Utilisateurs importés');

    // --- Insertion des partenaires
    const partenaires = await Partenaire.insertMany(partenairesData);
    console.log('✅ Partenaires importés');

    // --- Insertion des composants
    const composants = await Composant.insertMany(composantsData);
    console.log('✅ Composants importés');

    // --- Création de maps pour retrouver les _id à partir des identifiants de référence
    const utilisateursMap = {};
    utilisateurs.forEach(u => {
      utilisateursMap[u.email] = u._id; // on utilise l'email comme clé
    });

    const composantsMap = {};
    composants.forEach(c => {
      // Ici, composantsData doit contenir un champ unique (ex : "id") utilisé dans configurations.json pour référence
      composantsMap[c.id || c._id.toString()] = c._id;
    });

    // --- Préparation des configurations avec ObjectId corrects
    const configurationsFormatted = configurationsData.map((conf, index) => {
    return {
      nom_config: conf.nom_config || `Config ${index + 1}`,  // Ajout d'un nom par défaut si absent dans JSON
      utilisateur: utilisateursMap[conf.utilisateur_email],
      composants: conf.composants.map((cid) => composantsMap[cid]),
      date_creation: conf.date_creation,
      cout_total: conf.cout_total
    };
});

    await Configuration.insertMany(configurationsFormatted);
    console.log('✅ Configurations importées');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l’importation :', error);
    process.exit(1);
  }
};

// --- Lancement du script
importerDonnees();
