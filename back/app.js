// app.js
const express = require('express');

const authRoutes = require('./routes/auth');
const composantsRoutes = require('./routes/composants');
const utilisateurRoutes = require('./routes/utilisateurs');
const configurationsRoutes = require('./routes/configurations');
const categoriesRouter = require('./routes/categories');
const partenairesRoutes = require('./routes/partenaires'); 
const cors    = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send('Hello world !!');
});

app.use('/auth', authRoutes);
app.use('/composants', composantsRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/configurations', configurationsRoutes);
app.use('/categories', categoriesRouter);
app.use('/partenaires', partenairesRoutes);

module.exports = app;
