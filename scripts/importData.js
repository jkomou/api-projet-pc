const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

// Modèles
const Composant = require('../models/Composant');
const Utilisateur = require('../models/Utilisateur');
const Configuration = require('../models/Configuration');
const Partenaire = require('../models/Partenaire');
const Categorie = require('../models/Categorie');

// Connexion
mongoose.connect('mongodb+srv://' + dbUser + ':' + dbPassword + '@cluster0.v4ut44m.mongodb.net/configurateur_pc?retryWrites=true&w=majority&appName=Cluster0', 
     { useNewUrlParser: true, 
     useUnifiedTopology: true }) 
     .then(() => console.log('Connexion à MongoDB réussie !')) 
     .catch(() => console.log('Connexion à MongoDB échouée !')); 

// Lecture des fichiers JSON
const composants = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/components.json')));
const utilisateurs = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/utilisateurs.json')));
const configurations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/configurations.json')));
const partenaires = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/partenaires.json')));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json')));

async function importerDonnees() {
  try {

    await Composant.deleteMany();
    await Utilisateur.deleteMany();
    await Configuration.deleteMany();
    await Partenaire.deleteMany();
    await Categorie.deleteMany();

    await Composant.insertMany(composants);
    await Utilisateur.insertMany(utilisateurs);
    await Configuration.insertMany(configurations);
    await Partenaire.insertMany(partenaires);
    await Categorie.insertMany(categories);

    console.log('✅ Données importées avec succès.');
  } catch (err) {
    console.error('❌ Erreur lors de l’importation :', err);
  } finally {
    mongoose.connection.close();
  }
}

importerDonnees();