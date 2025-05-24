// Replace with your actual config from Firebase console
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZe_oaOpu1zem-xVAIEi0SXsK57A_VXVw",
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
