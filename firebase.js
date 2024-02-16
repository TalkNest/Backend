require('dotenv').config(); // This line should be at the top of your file
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Parse the JSON string from the environment variable back into a JSON object
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

module.exports = { db }