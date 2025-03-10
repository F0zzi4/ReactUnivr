import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPWQMWDCaFlR2Z3ELdb12VI_-uHpAt9kQ",
  authDomain: "localhost:5173",
  projectId: "mypersonaltraining-4e13c",
  storageBucket: "mypersonaltraining-4e13c.firebasestorage.app",
  messagingSenderId: "506702528063",
  appId: "1:506702528063:web:d351d52bc42b2e8ae3428a",
};

// Initialize Firebase App
const FirebaseApp = initializeApp(firebaseConfig);
// Initialize Authentication service
const Auth = getAuth(FirebaseApp);
// Initialize Firestore service
const Firestore = getFirestore(FirebaseApp);

export { Auth, Firestore };
