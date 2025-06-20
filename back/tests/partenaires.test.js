const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Partenaire = require('../models/Partenaire');
const Prix = require('../models/Prix');
const Composant = require('../models/Composant');
require('dotenv').config({ path: '.env.test' });

describe('Partenaires API', () => {
  let composant, partenaire;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterEach(async () => {
    await Partenaire.deleteMany({});
    await Prix.deleteMany({});
    await Composant.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /partenaires - Ajouter un partenaire', async () => {
    const res = await request(app).post('/partenaires').send({
      nom: 'Amazon'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.nom).toBe('Amazon');
  });

  test('GET /partenaires/:composantId/prix - Lister les prix d’un composant', async () => {
    composant = await new Composant({ titre: 'GTX 1650', marque: 'NVIDIA', categorie_id: 'GPU', prix: 150 }).save();
    partenaire = await new Partenaire({ nom: 'TopAchat' }).save();
    await new Prix({ partenaire: partenaire._id, composant: composant._id, prix: 145 }).save();

    const res = await request(app).get(`/partenaires/${composant._id}/prix`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].prix).toBe(145);
  });

  test('POST /partenaires/:partenaireId/prix/:composantId - Ajouter un prix', async () => {
    composant = await new Composant({ titre: 'Ryzen 5', marque: 'AMD', categorie_id: 'CPU', prix: 180 }).save();
    partenaire = await new Partenaire({ nom: 'CDiscount' }).save();

    const res = await request(app)
      .post(`/partenaires/${partenaire._id}/prix/${composant._id}`)
      .send({ prix: 170 });

    expect(res.statusCode).toBe(200);
    expect(res.body.prix).toBe(170);
  });
});
