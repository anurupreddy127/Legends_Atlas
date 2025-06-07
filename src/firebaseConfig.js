// Replace with your actual config from Firebase console
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "import.meta.env.VITE_FIREBASE_API_KEY",
  authDomain: "ramayana-map.firebaseapp.com",
  projectId: "ramayana-map",
  storageBucket: "ramayana-map.appspot.com",
  messagingSenderId: "507369343844",
  appId: "1:507369343844:web:367dd9a5950dcec8220871",
  measurementId: "G-QLJQ4CQ17D",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
