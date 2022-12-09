// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "*****************",
  authDomain: "tic-toc-toe-mult-player.firebaseapp.com",
  projectId: "tic-toc-toe-mult-player",
  storageBucket: "tic-toc-toe-mult-player.appspot.com",
  messagingSenderId: "*********",
  appId: "***********"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);