const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Composant = require('../models/Composant');
const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '.env.test' });

let token;

describe('Composants API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);

    // Nettoyer utilisateurs pour éviter doublons
    await Utilisateur.deleteMany({ email: 'test@example.com' });

    // Créer un utilisateur test (adapter la propriété mot_de_passe selon ton schéma)
    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = new Utilisateur({ email: 'test@example.com', mot_de_passe: hashedPassword });
    await user.save();

    // Connexion pour récupérer le token JWT
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', mot_de_passe: 'testpass' });

    token = res.body.accessToken;
  });

  afterEach(async () => {
    await Composant.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('POST /composants - Ajouter un composant', async () => {
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

  test('GET /composants - Lister composants', async () => {
    await new Composant({ titre: 'RTX 3060', marque: 'NVIDIA', categorie_id: 'GPU', prix: 400 }).save();

    const res = await request(app).get('/composants');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('PUT /composants/:id - Modifier un composant', async () => {
    const composant = await new Composant({ titre: 'RAM 8GB', marque: 'Corsair', categorie_id: 'RAM', prix: 50 }).save();

    const res = await request(app)
      .put(`/composants/${composant._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ prix: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.composant.prix).toBe(60);
  });

  test('DELETE /composants/:id - Supprimer un composant', async () => {
    const composant = await new Composant({ titre: 'SSD 500GB', marque: 'Samsung', categorie_id: 'Stockage', prix: 80 }).save();

    const res = await request(app)
      .delete(`/composants/${composant._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/supprimé/i);
  });
});
