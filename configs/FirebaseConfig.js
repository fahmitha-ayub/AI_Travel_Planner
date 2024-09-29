// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
  apiKey: "AIzaSyAMyOlVpiiSGBLUzyaR1htgtFka3DjejMs",
  authDomain: "aitravelplanner-9fb99.firebaseapp.com",
  projectId: "aitravelplanner-9fb99",
  storageBucket: "aitravelplanner-9fb99.appspot.com",
  messagingSenderId: "393464180858",
  appId: "1:393464180858:web:cd28532c371c3783424bc3",
  measurementId: "G-EBSPXC2LC6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
