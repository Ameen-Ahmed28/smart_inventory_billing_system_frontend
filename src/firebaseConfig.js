// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu4NCJBH9hjW5lP29z3h2DdMbK--JvxIQ",
  authDomain: "smart-inventory-billing-system.firebaseapp.com",
  projectId: "smart-inventory-billing-system",
  storageBucket: "smart-inventory-billing-system.firebasestorage.app",
  messagingSenderId: "429408875758",
  appId: "1:429408875758:web:9af8cc97fbe494348fefff",
  measurementId: "G-W8QVE9ZDLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;
