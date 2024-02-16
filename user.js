const express = require('express');
const { db } = require('./firebase.js');
const app = express();
const port = 8383;

app.use(express.json());

// Create a new user
app.post('/user', async (req, res) => {
    const { email, username, profilePicture, bio, location } = req.body;
    const createdAt = new Date();
    const updatedAt = createdAt; // Initially, createdAt and updatedAt will be the same

    // Generate a new user ID
    const userRef = db.collection('users').doc();
    await userRef.set({
        userId: userRef.id, // Firebase automatically generates the ID
        email,
        username,
        profilePicture,
        bio,
        location,
        createdAt,
        updatedAt,
        chats: []
    });

    res.status(201).send({ userId: userRef.id });
});

// Fetch a user by ID
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
        return res.sendStatus(404);
    }
    res.status(200).send(doc.data());
});

// Update a user's information
app.patch('/user/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date(); // Update the 'updatedAt' timestamp

    await db.collection('users').doc(id).update(updates);
    res.sendStatus(200);
});

// Delete a user
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    await db.collection('users').doc(id).delete();
    res.sendStatus(204);
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
