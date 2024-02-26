const express = require('express');
const cors = require('cors'); // Import CORS package
const {db} = require('./firebase.js');
const app = express();
const port = process.env.PORT || 8383;
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(bodyParser.json());

// Middleware to authenticate requests using Firebase Admin SDK
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(403).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Optionally, attach the decoded token to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(403).send('Unauthorized');
  }
};

// Register New User
app.post('/api/users', async (req, res) => {
  try {
    const {uid, email, displayName, photoURL, bio, location} = req.body;

    // Ensure all required fields are provided
    if (!uid || !displayName) {
      return res.status(400).json({message: 'Missing required fields'});
    }

    const createdAt = new Date();
    const updatedAt = createdAt; // For registration, createdAt and updatedAt will be the same

    // Create the user document in Firestore
    await db.collection('users').doc(uid).set({
      uid,
      email,
      displayName,
      photoURL,
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
    res.status(500).json({message: 'Failed to register user'});
  }
});

// Fetch a user by ID
app.get('/api/user/:id', async (req, res) => {
  const {id} = req.params;
  const doc = await db.collection('users').doc(id).get();
  if (!doc.exists) {
    return res.sendStatus(404);
  }
  res.status(200).json(doc.data());
});

// Update a user's information
app.patch('/api/user/:id', authenticate, async (req, res) => {
  const {id} = req.params;
  const updates = req.body;
  updates.updatedAt = new Date(); // Update the 'updatedAt' timestamp

  await db.collection('users').doc(id).update(updates);
  res.sendStatus(200);
});

// Delete a user
app.delete('/api/user/:id', authenticate, async (req, res) => {
  const {id} = req.params;
  await db.collection('users').doc(id).delete();
  res.sendStatus(204);
});

app.get('/api/users/search', async (req, res) => {
  const query = req.query.query.toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Missing 'query' parameter." });
  }

  try {
    const usersRef = db.collection('users');
    let snapshot = await usersRef.get();
    let users = [];

    snapshot.forEach(doc => {
      let userData = doc.data();
      // Convert searchable fields to lowercase before matching
      if (userData.email?.toLowerCase().includes(query) ||
        userData.displayName.toLowerCase().includes(query) ||
        userData.uid.includes(query)) { // Assuming userId is case-sensitive and exact
        users.push({
          uid: doc.id,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        });
      }
    });

    if (users.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
  }
});

///////////////////// Chat /////////////////////
app.post('/api/chats/select', async (req, res) => {
  const { currentUserUid, userUid } = req.body; // Extract user IDs from request body

  // Combine user IDs to create a unique identifier for the chat
  const combinedId = currentUserUid > userUid ? currentUserUid + userUid : userUid + currentUserUid;

  try {
    const chatRef = db.collection('chats').doc(combinedId);
    const chatSnap = await chatRef.get();

    if (!chatSnap.exists) {
      // If chat does not exist, create a new chat document
      await chatRef.set({ messages: [] });

      // Update userChats collection for currentUser
      await db.collection('userChats').doc(currentUserUid).set({
        [`${combinedId}.userInfo`]: { uid: userUid, displayName: 'User Display Name', photoURL: 'User Photo URL' },
        [`${combinedId}.date`]: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // Update userChats collection for the other user
      await db.collection('userChats').doc(userUid).set({
        [`${combinedId}.userInfo`]: { uid: currentUserUid, displayName: 'Current User Display Name', photoURL: 'Current User Photo URL' },
        [`${combinedId}.date`]: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    res.json({ message: 'Chat selected or created successfully' });
  } catch (error) {
    console.error('Error selecting or creating chat: ', error);
    res.status(500).send('Error selecting or creating chat');
  }
});

// API to get chats for a user
app.get('/api/chats/:userId', async (req, res) => {
  try {
    const userChatsRef = db.collection('userChats').doc(req.params.userId);
    const doc = await userChatsRef.get();
    if (!doc.exists) {
      return res.status(200).json([]); // Return an empty array instead of sending a 404 error
    }
    return res.status(200).json(doc.data());
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API to update or create a chat
app.post('/api/chats/:userId', async (req, res) => {
  const { chatId, chatData } = req.body;
  try {
    await db.collection('userChats').doc(req.params.userId).set({
      [chatId]: chatData
    }, { merge: true });
    return res.status(200).send('Chat updated successfully.');
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
module.exports = app;
