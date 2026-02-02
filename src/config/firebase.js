// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBHpAEKVhYUPhnjQIO5sPM28Q80k64_L0Y",
    authDomain: "movieexplorer-react.firebaseapp.com",
    projectId: "movieexplorer-react",
    storageBucket: "movieexplorer-react.firebasestorage.app",
    messagingSenderId: "271435433125",
    appId: "1:271435433125:web:d9d3e1ac50bf943567794c",
    measurementId: "G-D719C7CHS0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence);