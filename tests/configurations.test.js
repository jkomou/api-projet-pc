const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Configuration = require('../models/Configuration');
const User = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.test' });

describe('Configurations API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const hashedPassword = await bcrypt.hash('testpass', 10);
    const user = await new User({ email: 'config@test.com', mot_de_passe: hashedPassword }).save();

    userId = user._id;
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(async () => {
    await Configuration.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('POST /configurations - Créer une configuration', async () => {
    const res = await request(app)
      .post('/configurations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nom_config: 'Ma config gamer',  // <-- corriger ici
        composants: []
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.utilisateur).toBe(userId.toString());
  });

  test('GET /configurations - Lister mes configurations', async () => {
    await new Configuration({
        utilisateur: userId,
        nom_config: 'Setup bureau',  // <-- corriger ici
        composants: []
    }).save();

    const res = await request(app)
      .get('/configurations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nom_config).toBe('Setup bureau');
  });
});
