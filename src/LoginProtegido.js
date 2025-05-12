import React, { useState } from "react";
import Login from "./Login";
import click1 from "./sonido1.mp3";
import click2 from "./sonido2.mp3";

export default function LoginProtegido({ onLogin }) {
  const [puntos, setPuntos] = useState([]);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const punto1 = { x: 0.735, y: 0.217 };
  const punto2 = { x: 0.042, y: 0.618 };
  const margen = 0.015;

  const sonido1 = new Audio(click1);
  const sonido2 = new Audio(click2);

  const distancia = (a, b) =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

  const handleClick = (e) => {
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  const nuevoPuntos = [...puntos, { x, y }];

  console.log(`📍 [LoginProtegido] Click ${nuevoPuntos.length}:`, { x, y });

  if (nuevoPuntos.length === 1 && distancia(nuevoPuntos[0], punto1) < margen) {
    console.log("🔊 [LoginProtegido] Click correcto en punto 1");
    sonido1.play();
  }

  if (nuevoPuntos.length === 2 && distancia(nuevoPuntos[1], punto2) < margen) {
    console.log("🔊 [LoginProtegido] Click correcto en punto 2");
    sonido2.play();
  }

  if (nuevoPuntos.length === 2) {
    const acierto1 = distancia(nuevoPuntos[0], punto1) < margen;
    const acierto2 = distancia(nuevoPuntos[1], punto2) < margen;

    if (acierto1 && acierto2) {
      console.log("✅ [LoginProtegido] Ambos puntos correctos, mostrando login...");
      setMostrarLogin(true);
    } else {
      console.log("❌ [LoginProtegido] Fallo en puntos, reiniciando...");
      setPuntos([]);
    }
  } else {
    setPuntos(nuevoPuntos);
  }
};


  if (mostrarLogin) {
    console.log("🔓 [LoginProtegido] Login visible");
    return <Login onLogin={onLogin} />;
  }

  console.log("🖼️ [LoginProtegido] Renderizando fondo con puntos secretos...");
  return (
<div
  className="imagen-oculta"
  onClick={handleClick}
  style={{
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  }}
>
  <img
    src="/fondo-login.png"
    alt="fondo secreto"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />

  {/* Puntos rojos visuales
  <div
    style={{
      position: "absolute",
      left: `${punto1.x * 100}%`,
      top: `${punto1.y * 100}%`,
      width: 10,
      height: 10,
      backgroundColor: "red",
      borderRadius: "50%",
      zIndex: 10,
    }}
  />
  <div
    style={{
      position: "absolute",
      left: `${punto2.x * 100}%`,
      top: `${punto2.y * 100}%`,
      width: 10,
      height: 10,
      backgroundColor: "red",
      borderRadius: "50%",
      zIndex: 10,
    }}
  /> */}
</div>

  );
}
