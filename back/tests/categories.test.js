const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Composant = require('../models/Composant');
const Utilisateur = require('../models/Utilisateur');
const Categorie = require('../models/Categorie');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '.env.test' });

let token;
let categorieId;

describe('Composants API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // Créer une catégorie test
    const categorie = await Categorie.create({ nom: 'CPU' });
    categorieId = categorie._id.toString();

    // Supprimer tout utilisateur avec l'email test
    await Utilisateur.deleteMany({ email: 'test@example.com' });

    // Créer un utilisateur avec rôle admin
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = new Utilisateur({
      email: 'test@example.com',
      mot_de_passe: hashedPassword,
      role: 'admin', // ⚠️ Assure-toi que le schéma gère le rôle
    });
    await user.save();

    // Connexion
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', mot_de_passe: 'testpass' });

    token = res.body.accessToken;
  });

  afterEach(async () => {
    await Composant.deleteMany({});
  });

  afterAll(async () => {
    await Composant.deleteMany({});
    await Utilisateur.deleteMany({});
    await Categorie.deleteMany({});
    await mongoose.connection.close();
  });

  test('POST /composants - Ajouter un composant', async () => {
    const res = await request(app)
      .post('/composants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titre: 'Intel Core i5',
        marque: 'Intel',
        categorie_id: categorieId,
        prix: 200,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.composant).toHaveProperty('titre', 'Intel Core i5');
  });

  test('GET /composants - Lister composants', async () => {
    await Composant.create({
      titre: 'RTX 3060',
      marque: 'NVIDIA',
      categorie_id: categorieId,
      prix: 400,
    });

    const res = await request(app).get('/composants');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('PUT /composants/:id - Modifier un composant', async () => {
    const composant = await Composant.create({
      titre: 'RAM 8GB',
      marque: 'Corsair',
      categorie_id: categorieId,
      prix: 50,
    });

    const res = await request(app)
      .put(`/composants/${composant._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ prix: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.composant.prix).toBe(60);
  });

  test('DELETE /composants/:id - Supprimer un composant', async () => {
    const composant = await Composant.create({
      titre: 'SSD 500GB',
      marque: 'Samsung',
      categorie_id: categorieId,
      prix: 80,
    });

    const res = await request(app)
      .delete(`/composants/${composant._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });
});
