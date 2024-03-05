# TalkNest Backend APIs

## Introduction
This project is a Node.js backend application that uses Firebase, specifically Firestore, for database operations. It demonstrates basic CRUD operations for user management.

## Technologies Used

- **React.js**: A JavaScript library for building user interfaces, used for structuring the frontend.
- **Socket.io-client**: Enables real-time, bidirectional communication between web clients and servers.
- **Simple-peer**: A simple WebRTC peer-to-peer communication library.
- **Firebase**: Utilized for authentication and real-time database operations.
- **Material-UI**: A popular React UI framework that provides ready-to-use components.

## Features

- Real-time text messaging.
- Video and audio calls with WebRTC.
- User authentication and profile management.
- Search functionality for users.
- Responsive design for a seamless experience on various devices.

## Setup
Before running the project, ensure you have Node.js and npm installed. Follow these steps to set up the project:

1. **Clone the repository**
   ```bash
   git clone https://github.com/TalkNest/backend.git
   ```
2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```
3. **Configure Firebase**
    - Obtain your Firebase project credentials and save them in a file named firebase-config.json in the project root.
   - Set up the Firebase Admin SDK by following the Firebase documentation.
4. **Environment Variables**
    - Create a .env file in the project root and add the following: 
   ```bash
   FIREBASE_CREDENTIALS='YOUR_FIREBASE_CREDENTIALS'
   PORT='8383'
   ```
   
## Usage
To run the project, use the following command:
   ```bash
   node server.js
   ```
