import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHYulhv4lQCrF6AyR0v0VIvbqcrBlFoIs",
  authDomain: "notas-44952.firebaseapp.com",
  projectId: "notas-44952",
  storageBucket: "notas-44952.firebasestorage.app",
  messagingSenderId: "609736841793",
  appId: "1:609736841793:web:c6b28481d7e055505dc4c0",
  measurementId: "G-J4LS9Q6316"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const db = getFirestore(app);
export const auth = getAuth(app);

// 👉 Esta línea impide que recuerde la sesión al recargar/cerrar
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("✅ Persistencia establecida: sólo por sesión (browserSessionPersistence)");
  })
  .catch((error) => {
    console.error("❌ Error al establecer la persistencia:", error);
  });
