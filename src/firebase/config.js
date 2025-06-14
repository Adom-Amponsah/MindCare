// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfreBbudygBbFrPRuNdcQ4z2j91nZ8u-c",
  authDomain: "mindcare-6ade1.firebaseapp.com",
  projectId: "mindcare-6ade1",
  storageBucket: "mindcare-6ade1.firebasestorage.app",
  messagingSenderId: "944457080977",
  appId: "1:944457080977:web:38d16ca46f64a864851f30",
  measurementId: "G-ZXTVT853W4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;

// Only initialize analytics in browser environment
try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Analytics initialization error:", error);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, analytics, db };
export default app; 