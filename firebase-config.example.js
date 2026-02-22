// src/firebase-config.example.js
// COPY THIS FILE TO firebase-config.js AND FILL IN YOUR SECRETS
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "YOUR_NEW_API_KEY_HERE",
    authDomain: "let-spole.firebaseapp.com",
    projectId: "let-spole",
    storageBucket: "let-spole.firebasestorage.app",
    messagingSenderId: "637366702375",
    appId: "1:637366702375:web:eb69495bc078a44f459902",
    measurementId: "G-WGKG8YMH81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
