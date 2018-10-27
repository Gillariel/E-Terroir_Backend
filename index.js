const express = require ('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const login = require('./Auth');

app.get('/login', (req, res) => {
    login.login();
});

// Handling Firebase Firestore
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
// [Works]
app.post('/user', function(req, res){
    // example of catching exeception and react with correct HTTP code
    db.collection('User').doc().set({
        Email: req.body.Email,
        Mdp: req.body.Mdp,
        Pseudo: req.body.Pseudo,
        Address: req.body.Address
    }).then(() => { return res.sendStatus(200); })
    .catch(() => { return res.sendStatus(404); });
    return res.sendStatus(403);
});

// I Did not check til here

// FARMER

//Get all Farmer
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
app.get('/farmerId/:id', function (req, res) {
    db.collection('Farmer').get().where('id == :id')
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
app.post('/newFarmer', function(req, res){
    db.collection('Farmer').doc().set({
        Nom: req.body.Nom,
        Prenom: req.body.Prenom,
        Lattitude: req.body.Lattitude,
        Longitude: req.body.Longitude,
        Product :{}
    });
    return res.sendStatus(200);
});

// CATEGORIE

//Get all Categorie
app.get('/categorie', function (req, res) {
    db.collection('Categorie').get()
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

//Get Categorie by Id
app.get('/categorieId/:id', function (req, res) {
    db.collection('Categorie').get().where('id == :id')
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

//Post a Categorie
app.post('/newCategorie', function(req, res){
    db.collection('Categorie').doc().set({
        Nom: req.body.Nom,
        Product :{}
    });
    return res.sendStatus(200);
});

//PRODUCT

//Get Product of one Farmer
app.get('/products/:id', (req, res) => {
    db.collection('Farmer').get({_id: req.param.id})
    .then((snapshot) => {
        var datas = {};
        snapshot.forEach((doc) => {
            console.log('farmer : ' + doc.data().Name);
            doc.collection('products').get()
            .then((snapshot2) => {
                snapshot2.forEach((doc2) => {
                    datas.push({
                        product: doc2.data(),
                        farmer: doc
                    });
                    return res.json(datas);
                });
            }).catch((err2) => {
                console.log('Error 2 getting documents', err2);
            });
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

//Get Product by Id

app.get('/productsId/:id', (req, res) => {
    db.collection('farmers').get()
    .then((snapshot) => {
        var datas = {};
        snapshot.forEach((doc) => {
            console.log('farmer : ' + doc.data().Name);
            doc.collection('products').get({_id: req.param.id})
            .then((snapshot2) => {
                snapshot2.forEach((doc2) => {
                    datas.push({
                        product: doc2.data(),
                        farmer: doc
                    });
                    return res.json(datas);
                });
            }).catch((err2) => {
                console.log('Error 2 getting documents', err2);
            });
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

//Post a Product

app.post('/newProduct/:id', (req, res)=>{
    
})

//HISTORIQUE

//Get Historique of one User
app.get('/historique/:id', (req, res) => {
    db.collection('User').get({_id: req.param.id})
    .then((snapshot) => {
        var datas = {};
        snapshot.forEach((doc) => {
            console.log('user : ' + doc.data().Name);
            doc.collection('Historique').get()
            .then((snapshot2) => {
                snapshot2.forEach((doc2) => {
                    datas.push({
                        historique: doc2.data(),
                        user: doc
                    });
                    return res.json(datas);
                });
            }).catch((err2) => {
                console.log('Error 2 getting documents', err2);
            });
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

//Get Product by Id

app.get('/historique/:id', (req, res) => {
    db.collection('User').get()
    .then((snapshot) => {
        var datas = {};
        snapshot.forEach((doc) => {
            console.log('User : ' + doc.data().Pseudo);
            doc.collection('Historique').get({_id: req.param.id})
            .then((snapshot2) => {
                snapshot2.forEach((doc2) => {
                    datas.push({
                        historique: doc2.data(),
                        user: doc
                    });
                    return res.json(datas);
                });
            }).catch((err2) => {
                console.log('Error 2 getting documents', err2);
            });
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

//Post a Historique

//NOTE

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