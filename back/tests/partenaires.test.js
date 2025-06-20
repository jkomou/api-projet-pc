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

  describe('POST /partenaires/:partenaireId/prix/:composantId', () => {
  let adminToken;
  let partenaireId, composantId;

  beforeAll(async () => {
    // Connexion admin
    const resLogin = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        mot_de_passe: 'motDePasseAdmin',
      });
    adminToken = resLogin.body.accessToken;

    // Création données nécessaires (si besoin)
    const partenaireRes = await request(app)
      .post('/partenaires')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nom: 'TestPartner', site_web: 'https://test.fr' });
    partenaireId = partenaireRes.body._id;

    const composantRes = await request(app)
      .post('/composants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ titre: 'TestCPU', categorie_id: 'cat_cpu', marque: 'Intel', prix: 100, specifications: {} });
    composantId = composantRes.body._id;
  });

  it('doit ajouter un prix pour un composant donné', async () => {
    const res = await request(app)
      .post(`/partenaires/${partenaireId}/prix/${composantId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ prix: 170 });

    expect(res.statusCode).toBe(200);
    expect(res.body.prix).toBe(170);
  });
});
});
