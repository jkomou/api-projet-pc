require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const port = process.env.PORT || 8000;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;
const authRoutes = require('./routes/auth'); // si le fichier est dans routes/
const composantsRoutes = require('./routes/composants');

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('Hello world !!');
});

app.use(express.json());

app.use(authRoutes); // Monte les routes de auth.js
app.use('/composants', composantsRoutes);

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

mongoose.connect('mongodb+srv://' + dbUser + ':' + dbPassword + '@cluster0.v4ut44m.mongodb.net/configurateur_pc?retryWrites=true&w=majority&appName=Cluster0', 
     { useNewUrlParser: true, 
     useUnifiedTopology: true }) 
     .then(() => console.log('Connexion à MongoDB réussie !')) 
     .catch(() => console.log('Connexion à MongoDB échouée !')); 
    