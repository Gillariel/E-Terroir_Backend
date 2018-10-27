const express = require ('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const admin = require('firebase-admin');

var serviceAccount = require('./e-terroir-gcp.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

var db = admin.firestore();

app.get('/', function (req, res) {
    db.collection('bidon');
    db.collection('bidon').get()
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

app.get('/products', (req, res) => {
    // Ask firebase
    db.collection('farmers').get()
    .then((snapshot) => {
        var products = {};
        snapshot.forEach((doc) => {
            console.log('farmer : ' + doc.data().Name);
            doc.collection('products').get()
            .then((snapshot2) => {
                snapshot2.forEach((doc2) => {
                    products.push({
                        product: doc2.data(),
                        farmer: doc
                    });
                    return res.json(products);
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