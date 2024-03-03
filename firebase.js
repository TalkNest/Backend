require('dotenv').config(); // This line should be at the top of your file
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getDatabase } = require('firebase-admin/database');

// Parse the JSON string from the environment variable back into a JSON object
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://talknest-22b42-default-rtdb.firebaseio.com"
})

const db = getFirestore()
const realTimeDatabase = getDatabase();

module.exports = { db, realTimeDatabase }
