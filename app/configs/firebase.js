// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

require('firebase/auth')

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCopRAvt1Em_GTWC13wxakTYj2wgGxliqo",
    authDomain: "butlr-3c47a.firebaseapp.com",
    projectId: "butlr-3c47a",
    storageBucket: "butlr-3c47a.appspot.com",
    messagingSenderId: "410817117947",
    appId: "1:410817117947:web:e2894b5f52499abf5a3a5e",
    measurementId: "G-FLF4CW17QF"
};

// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = app.auth()
const db = firebase.firestore()
const timestamp = firebase.firestore.FieldValue.serverTimestamp()
// const analytics = getAnalytics(app);

export {auth, db, timestamp}