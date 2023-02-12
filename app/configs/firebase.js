// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore, serverTimestamp, collection, doc, getDoc, setDoc, getDocs} from "firebase/firestore";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import {getFunctions, httpsCallable} from "firebase/functions";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const timestamp = serverTimestamp();
const functions = getFunctions(app);
const storage = getStorage(app);

export {
    auth,
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword,
        signOut,
        updateProfile,
    db,
        timestamp,
        collection,
        doc,
        getDoc,
        setDoc,
        getDocs,
    functions,
        httpsCallable,
    storage,
        ref,
        uploadBytesResumable,
        getDownloadURL
}