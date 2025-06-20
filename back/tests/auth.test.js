const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Utilisateur = require('../models/Utilisateur');
const Refresh = require('../models/Refresh');
require('dotenv').config({ path: '.env.test' });

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Utilisateur.deleteMany({});
    await Refresh.deleteMany({});
  });

  test('POST /auth/signup - inscription réussie', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/créé/i);
  });

  test('POST /auth/signup - email déjà utilisé', async () => {
    await new Utilisateur({ email: 'user@test.com', mot_de_passe: 'hashedpass' }).save();
    const res = await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/déjà utilisé/i);
  });

  test('POST /auth/login - connexion réussie', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  test('POST /auth/login - mauvais mot de passe', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', mot_de_passe: 'mauvaispass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/mot de passe/i);
  });

  test('POST /auth/login - utilisateur inconnu', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'inconnu@test.com', mot_de_passe: 'password123' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/non trouvé/i);
  });

  test('POST /auth/token - rafraîchir token avec refreshToken valide', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const { refreshToken } = loginRes.body;

    const res = await request(app)
      .post('/auth/token')
      .send({ token: refreshToken });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /auth/token - rafraîchir token avec refreshToken invalide', async () => {
    const res = await request(app)
      .post('/auth/token')
      .send({ token: 'tokeninvalide' });
    expect(res.statusCode).toBe(403);
  });

  test('POST /auth/logout - supprimer refresh token', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const { refreshToken } = loginRes.body;

    const res = await request(app)
      .post('/auth/logout')
      .send({ token: refreshToken });
    expect(res.statusCode).toBe(204);
  });

  test('GET /auth/me - récupérer infos utilisateur avec token valide', async () => {
    await request(app)
      .post('/auth/signup')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'user@test.com', mot_de_passe: 'password123' });

    const { accessToken } = loginRes.body;

    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', 'user@test.com');
    expect(res.body).not.toHaveProperty('mot_de_passe');
  });

  test('GET /auth/me - sans token retourne 401', async () => {
    const res = await request(app)
      .get('/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
