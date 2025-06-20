const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Composant = require('../models/Composant');
const User = require('../models/Utilisateur');
require('dotenv').config({ path: '.env.test' });

describe('Composants API', () => {
  let token; // token d’authentification

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Supprime l'utilisateur test s'il existe
    await User.deleteMany({ email: 'test@test.com' });

    // Crée un utilisateur avec mot_de_passe obligatoire
    const user = new User({ email: 'test@test.com', mot_de_passe: 'password' });
    await user.save();

    // Connexion via la route /auth/login pour récupérer un token valide
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', mot_de_passe: 'password' });

    if (res.statusCode !== 200) {
      throw new Error(`Échec du login test : status ${res.statusCode} body ${JSON.stringify(res.body)}`);
    }

    token = res.body.accessToken;
    if (!token) {
      throw new Error('Token JWT non reçu après login dans beforeAll');
    }
  });

  afterEach(async () => {
    await Composant.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /composants - Ajouter un composant (protégé)', async () => {
    const res = await request(app)
      .post('/composants')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titre: 'Intel Core i5',
        marque: 'Intel',
        categorie_id: 'CPU',
        prix: 200,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.composant).toHaveProperty('titre', 'Intel Core i5');
  });

  test('GET /composants - Lister composants (publique)', async () => {
    await new Composant({
      titre: 'RTX 3060',
      marque: 'NVIDIA',
      categorie_id: 'GPU',
      prix: 400,
    }).save();

    const res = await request(app).get('/composants');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('PUT /composants/:id - Modifier un composant (protégé)', async () => {
    const composant = await new Composant({
      titre: 'RAM 8GB',
      marque: 'Corsair',
      categorie_id: 'RAM',
      prix: 50,
    }).save();

    const res = await request(app)
      .put(`/composants/${composant._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ prix: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.composant.prix).toBe(60);
  });

  test('DELETE /composants/:id - Supprimer un composant (protégé)', async () => {
    const composant = await new Composant({
      titre: 'SSD 500GB',
      marque: 'Samsung',
      categorie_id: 'Stockage',
      prix: 80,
    }).save();

    const res = await request(app)
      .delete(`/composants/${composant._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });
});
