// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.Firebase_API_KEY,
  authDomain: "reprot-and-demostration.firebaseapp.com",
  projectId: "reprot-and-demostration",
  storageBucket: "reprot-and-demostration.appspot.com",
  messagingSenderId: "39611026456",
  appId: "1:39611026456:web:1a5482c55ed423bfef076d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);