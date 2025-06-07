const express = require('express');
const mongoose = require('mongoose'); 
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.send('Hello world !!');
});

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

mongoose.connect('mongodb+srv://admin:admin123@cluster0.v4ut44m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', 
     { useNewUrlParser: true, 
     useUnifiedTopology: true }) 
     .then(() => console.log('Connexion à MongoDB réussie !')) 
     .catch(() => console.log('Connexion à MongoDB échouée !')); 
    