const express = require ('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const admin = require('firebase-admin');

var serviceAccount = require('/FB_Json_File.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })

var db = firebase.firestore();

app.get('/products', (req, res) => {
    // Ask firebase

    // Then return as Json
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