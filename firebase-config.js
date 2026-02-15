// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: User must replace this with their own config from Firebase Console
// Create a project at https://console.firebase.google.com/
// Go to Project Settings -> General -> Your apps -> Web app -> SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPqlCgEM354Gld--G9hSKTNNnJP2KmKuM",
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
