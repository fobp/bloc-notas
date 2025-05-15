import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

// Configuración de tu proyecto Firebase


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
