# TalkNest Backend APIs

## Introduction
This project is a Node.js backend application that uses Firebase, specifically Firestore, for database operations. It demonstrates basic CRUD operations for user management.

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
   npm start
   ```