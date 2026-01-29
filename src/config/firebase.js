// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBQUhmPH-sRUZHBAOT5sPVSCn_G4D7cCCE",
  authDomain: "lofr-69f8f.firebaseapp.com",
  projectId: "lofr-69f8f",
  storageBucket: "lofr-69f8f.firebasestorage.app",
  messagingSenderId: "103643529181",
  appId: "1:103643529181:web:95b32e004e7b06fce2c034",
  measurementId: "G-HRV26VHQ3G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()