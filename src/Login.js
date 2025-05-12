// src/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import "./LoginHacker.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accesoConcedido, setAccesoConcedido] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAccesoConcedido(true);
      setError("");
      setTimeout(() => {
        onLogin();
      }, 3000); // Espera 3s para mostrar animación completa
    } catch (err) {
      setError("ACCESS DENIED");
    }
  };

  return (
    <div className="hacker-bg">
      <div className="hacker-login">
        {accesoConcedido ? (
          <div className="access-granted-banner">
            <p className="access-line"> ACCESS GRANTED_</p>
            <p className="welcome-line">WELCOME BACK, AGENT</p>
          </div>
        ) : (
          <h2 className="terminal-title">ACCESS REQUIRED</h2>
        )}

        {!accesoConcedido && (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="user@matrix.net"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">ENTER</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
