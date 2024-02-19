const express = require('express');
const cors = require('cors'); // Import CORS package
const { db } = require('./firebase.js');
const app = express();
const port = process.env.PORT || 8383;
const bodyParser = require('body-parser');

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json());

// Register New User
app.post('/api/users', async (req, res) => {
    try {
        const { userId, email, username, profilePicture, bio, location } = req.body;

        // Ensure all required fields are provided
        if (!userId || !username) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const createdAt = new Date();
        const updatedAt = createdAt; // For registration, createdAt and updatedAt will be the same

        // Create the user document in Firestore
        await db.collection('users').doc(userId).set({
            userId,
            email,
            username,
            profilePicture,
            bio,
            location,
            createdAt,
            updatedAt,
            chats: [] // Initialize with an empty array
        });

        res.status(201).json({
            createdAt,
            updatedAt,
            message: 'User profile created successfully.'
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user' });
    }
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