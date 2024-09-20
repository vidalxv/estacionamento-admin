import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpSbUs_N6J58qWrl6K_RnD6fl6v9gIKMU",
  authDomain: "estacionamento-web.firebaseapp.com",
  databaseURL: "https://estacionamento-web-default-rtdb.firebaseio.com",
  projectId: "estacionamento-web",
  storageBucket: "estacionamento-web.appspot.com",
  messagingSenderId: "244370712518",
  appId: "1:244370712518:web:0b498b8090794a3c3cb4c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

