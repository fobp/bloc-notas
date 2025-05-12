import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Notas from "./Notas";
import "./App.css";
import LoginProtegido from "./LoginProtegido";

export default function App() {
  const [user, setUser] = useState(null);

 useEffect(() => {
  const unsub = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      // Espera 2 segundos antes de mostrar la app
      setTimeout(() => setUser(currentUser), 3000);
    } else {
      setUser(null);
    }
  });
  return () => unsub();
}, []);


  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  if (!user) {
    console.log("🔒 [App.js] No hay usuario, mostrar LoginProtegido");
    return (
      <LoginProtegido
        onLogin={() => {
          console.log("✅ [App.js] onLogin desde LoginProtegido ejecutado");
          onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
              console.log("⚡ [App.js] Usuario tras login:", currentUser);
              setUser(currentUser);
            }
          });
        }}
      />
    );
  }

 return <Notas />;

}

