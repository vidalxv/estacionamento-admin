import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDa4AcAoxM6ZqMTKJtTfHM6QHq_2XKYCJ4",
  authDomain: "estacionamento-esp32.firebaseapp.com",
  projectId: "estacionamento-esp32",
  storageBucket: "estacionamento-esp32.appspot.com",
  messagingSenderId: "177553823377",
  appId: "1:177553823377:web:55ebadd8dd712145191130"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db, firebaseApp }; 