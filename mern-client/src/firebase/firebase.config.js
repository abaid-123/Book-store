// firebase.config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBjiRgx-fm4nGSG6UzeX4k0gFB0HRG5_D0",
  authDomain: "mern-book-inventory-3e384.firebaseapp.com",
  projectId: "mern-book-inventory-3e384",
  storageBucket: "mern-book-inventory-3e384.appspot.com",
  messagingSenderId: "336486724335",
  appId: "1:336486724335:web:f91dc7da20654ec1a3e11a"
};

const app = initializeApp(firebaseConfig);
export default app;
