// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyDZe_oaOpu1zem-xVAIEi0SXsK57A_VXVw",
authDomain: "ramayana-map.firebaseapp.com",
projectId: "ramayana-map",
storageBucket: "ramayana-map.firebasestorage.app",
messagingSenderId: "507369343844",
appId: "1:507369343844:web:367dd9a5950dcec8220871",
measurementId: "G-QLJQ4CQ17D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
