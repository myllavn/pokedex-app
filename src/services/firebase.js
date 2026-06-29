import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDITT4u9zQ0s66aWrR-4_TU1m4gmJcxpWA",
  authDomain: "pokedex-app-9859c.firebaseapp.com",
  projectId: "pokedex-app-9859c",
  storageBucket: "pokedex-app-9859c.firebasestorage.app",
  messagingSenderId: "356181421056",
  appId: "1:356181421056:web:1fb5a4a4faa3842126fce5",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);