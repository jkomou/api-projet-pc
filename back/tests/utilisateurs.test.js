const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/Utilisateur');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

describe('Utilisateurs API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true, useUnifiedTopology: true });
    // Créer un utilisateur de test et token
    const user = new User({ email: 'user@test.com', mot_de_passe: 'password' });
    await user.save();
    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('GET /utilisateurs/ - Doit retourner la liste des utilisateurs protégée', async () => {
    const res = await request(app)
      .get('/utilisateurs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Autres tests CRUD utilisateurs ici...
});
