const express = require ('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const admin = require('firebase-admin');

var serviceAccount = require('./e-terroir-gcp.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

var db = admin.firestore();

// USER

//Get all User
// [Works]
app.get('/user', function (req, res) {
    db.collection('User').get()
    .then((snap) => {
        var datas = [];
        snap.forEach((doc) => {
            datas.push(doc.data());
        });
        return res.json(datas);
    }).catch(err => {
        console.log("errror " + err);
    });
});

//Get User by DOCUMENT Id (really worth it?)
// [Works]
app.get('/user/:id', function (req, res) {
    // This is how we get the GET params from the url
    var id = req.params.id;

    db.collection('User').where(admin.firestore.FieldPath.documentId(), '==', id).get()
    .then((snap) => {
        var datas = [];
        snap.forEach((doc) => {
            datas.push(doc.data());
        });
        return res.json(datas);
    }).catch(err => {
        console.log("error " + err);
    });
});

//Post a User
//[Works]
app.post('/user', function(req, res){
    db.collection('User').doc().set({
        Email: req.body.Email,
        Mdp: req.body.Mdp,
        Pseudo: req.body.Pseudo,
        Address: req.body.Address,
        Historique:{}
    }).then(() => { return res.sendStatus(200); })
    .catch(() => { return res.sendStatus(404); });
});

// I Did not check til here

// FARMER

//Get all Farmer
// [Works]
app.get('/farmer', function (req, res) {
    db.collection('Farmer').get()
    .then((snap) => {
        var datas = [];
        snap.forEach((doc) => {
            datas.push(doc.data());
        });
        return res.json(datas);
    }).catch(err => {
        console.log("errror " + err);
    });
});

//Get Farmer by Id
app.get('/farmer/:id', function (req, res) {
    var id = req.params.id;

    db.collection('Farmer').where(admin.firestore.FieldPath.documentId(), '==', id).get()
    .then((snap) => {
        var datas = [];
        snap.forEach((doc) => {
            datas.push(doc.data());
        });
        return res.json(datas);
    }).catch(err => {
        console.log("errror " + err);
    });
});

//Post a Farmer
app.post('/farmer', function(req, res){
    db.collection('Farmer').doc().set({
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Lattitude: req.body.Lattitude,
        Longitude: req.body.Longitude,
        Product :{}
    }).then(() => { return res.sendStatus(200); })
    .catch(() => { return res.sendStatus(404); });
});

//PRODUCT

//Get Product of one Farmer
app.get('/products/:id', (req, res) => {
    var id = req.params.id;
    db.collection('Farmer').doc(id).collection('Product').get()
    .then((snapshot) => {
            var datas = [];
            console.log("before second forLoop");
            snapshot.forEach((doc2) => {
                datas.push({
                    product: doc2.data(),
               });
               return res.json(datas);
            })
    })
});

//Post a Product

app.post('/products/:id', (req, res)=>{
    var id = req.params.id;
    db.collection('Farmer').doc(id).collection('Product').doc().set({
        Nom: req.body.Nom,
        Description : req.body.Description,
        Prix : req.body.Prix,
        Categorie : req.body.Categorie
    }).then(() => { return res.sendStatus(200); })
    .catch(() => { return res.sendStatus(404); });
})

//HISTORIQUE

//Get Historique of one User
app.get('user/:id/historique/', (req, res) => {
    var id = req.params.id;
    db.collection('User').doc(id).collection('Historique').get()
    .then((snapshot) => {
            var datas = [];
            console.log("before second forLoop");
            snapshot.forEach((doc2) => {
                datas.push({
                    historique: doc2.data(),
               });
               return res.json(datas);
            })
    })
});

//Post a Historique

app.post('/historique/:id', (req, res)=>{
    var id = req.params.id;
    db.collection('Historique').doc(id).collection('Product').doc().set({
        Product :{
            Date: req.body.Date,
            PrixTotal : req.body.PrixTotal,
            IdProduct : req.body.IdProduct
        }
    }).then(() => { return res.sendStatus(200); })
    .catch(() => { return res.sendStatus(404); });
})

//NOTE

//Get all Note
app.get('/note', function (req, res) {
    db.collection('Note').get()
    .then((snap) => {
        var datas = [];
        snap.forEach((doc) => {
            datas.push(doc.data());
        });
        return res.json(datas);
    }).catch(err => {
        console.log("errror " + err);
    });
});

//Get Note by DOCUMENT Id 
app.get('/note/:id', function (req, res) {
    var id = req.params.id;

    db.collection('Note').where(admin.firestore.FieldPath.documentId(), '==', id).get()
    .then((snap) => {
        var datas = [];
        snap.forEach((doc) => {
            datas.push(doc.data());
        });
        return res.json(datas);
    }).catch(err => {
        console.log("error " + err);
    });
});

//Post a Note
app.post('/note', function(req, res){
    db.collection('Note').doc().set({
        note : req.body.Note,
        commentaire : req.body.Commentaire,
        idUser: req.body.IdUser,
        idProduct : req.body.IdProduct
    }).then(() => { return res.sendStatus(200); })
    .catch(() => { return res.sendStatus(404); });
});

/**
 * Creating a document example
 */
function Create() {
    var docRef = db.collection('CollectionName').doc('DocumentID');
    var setAda = docRef.set({
        aField: 'Blablabla',
        anotherField: 'Bilibiliboulou'
    });
}

/**
 * Getting a document of a collection
 */
function Get() {
    db.collection('CollectionName').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
}

app.listen(10000, 'localhost', () => {
    console.log("server started successfully");
});