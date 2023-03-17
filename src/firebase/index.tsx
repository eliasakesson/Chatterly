// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaw9pzMQJk4HYJIqdfRnoLOuB7fL5jWCI",
  authDomain: "discord-ecaf3.firebaseapp.com",
  projectId: "discord-ecaf3",
  storageBucket: "discord-ecaf3.appspot.com",
  messagingSenderId: "1057300002813",
  appId: "1:1057300002813:web:104feddeeeccb5aed7cb94"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);