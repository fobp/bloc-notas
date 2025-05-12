// src/Notas.js
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import "./NotasHacker.css";

export default function Notas() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [importante, setImportante] = useState(false);
  const [notas, setNotas] = useState([]);
  const [notaActiva, setNotaActiva] = useState(null);
  const [vistaNota, setVistaNota] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [modoEdicionVista, setModoEdicionVista] = useState(false);
  const [edicionTitulo, setEdicionTitulo] = useState("");
  const [edicionContenido, setEdicionContenido] = useState("");

  const notasRef = collection(db, "notas");

  useEffect(() => {
    const unsub = onSnapshot(notasRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotas(docs.sort((a, b) => b.fechaCreacion?.toDate() - a.fechaCreacion?.toDate()));
    });
    return () => unsub();
  }, []);

  const guardarNota = async () => {
    if (titulo.trim() === "" || contenido.trim() === "") return;
    await addDoc(notasRef, {
      titulo,
      contenido,
      importante,
      fechaCreacion: Timestamp.now(),
      ultimaEdicion: Timestamp.now(),
    });
    limpiarFormulario();
  };

  const actualizarNota = async () => {
    if (!notaActiva) return;
    await updateDoc(doc(db, "notas", notaActiva.id), {
      titulo,
      contenido,
      importante,
      ultimaEdicion: Timestamp.now(),
    });
    limpiarFormulario();
  };

  const actualizarDesdeVista = async () => {
    if (!vistaNota) return;
    await updateDoc(doc(db, "notas", vistaNota.id), {
      titulo: edicionTitulo,
      contenido: edicionContenido,
      ultimaEdicion: Timestamp.now(),
    });
    setModoEdicionVista(false);
    setVistaNota({
      ...vistaNota,
      titulo: edicionTitulo,
      contenido: edicionContenido,
      ultimaEdicion: Timestamp.now(),
    });
  };

  const eliminarNota = async (id) => {
    await deleteDoc(doc(db, "notas", id));
    if (vistaNota?.id === id) setVistaNota(null);
  };

  const cargarNota = (nota) => {
    setNotaActiva(nota);
    setTitulo(nota.titulo);
    setContenido(nota.contenido);
    setImportante(nota.importante);
    setVistaNota(null);
  };

  const verNota = (nota) => {
    setVistaNota(nota);
    setEdicionTitulo(nota.titulo);
    setEdicionContenido(nota.contenido);
    setModoEdicionVista(false);
    setNotaActiva(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNotaActiva(null);
    setTitulo("");
    setContenido("");
    setImportante(false);
  };

  const handleLogout = () => {
    signOut(auth);
  };

 return (
  <div className="notas-app">
    {/* Fondo gif */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${process.env.PUBLIC_URL + '/giphy.gif'})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        zIndex: -2,
      }}
    />
    {/* Capa negra con opacidad */}
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: -1,
      }}
    />

    {/* Texto flotante tipo terminal */}
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        fontFamily: 'Courier New, monospace',
        color: '#00FF00',
        fontSize: '2rem',
        textShadow: '0 0 10px #00FF00',
        zIndex: 999,
      }}
    >
      
    </div>
      <header className="notas-header">
        <h1 className="titulo-principal">Bloc de Notas Privado</h1>
        <div className="header-user-info">
          <p>Bienvenido, {auth.currentUser?.email}</p>
          <button className="btn-hacker" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <div className="notas-wrapper">
        {/* Columna izquierda */}
        <div className="notas-col">
          <h2 className="titulo-hacker">{notaActiva ? "Editar Nota" : "Nueva Nota"}</h2>
          <input
            type="text"
            className="input-hacker"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            className="textarea-hacker"
            placeholder="Contenido de la nota"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />
          <label className="checkbox-hacker">
            <input
              type="checkbox"
              checked={importante}
              onChange={() => setImportante(!importante)}
            />
            ¿Es importante?
          </label>
          <button className="btn-hacker" onClick={notaActiva ? actualizarNota : guardarNota}>
            {notaActiva ? "Actualizar" : "Guardar"}
          </button>

          <h3 style={{ marginTop: 30, color: "#0f0" }}>Mis Notas</h3>
          <input
            className="input-hacker"
            type="text"
            placeholder="Buscar..."
            style={{ marginBottom: "10px" }}
            onChange={(e) => setFiltro(e.target.value.toLowerCase())}
          />
          <div className="notas-scroll">
            {notas
              .filter((n) =>
                n.titulo.toLowerCase().includes(filtro) ||
                n.contenido.toLowerCase().includes(filtro)
              )
              .map((n) => (
                <div
                  key={n.id}
                  className={`nota ${n.importante ? "nota-importante" : ""}`}
                  onClick={() => verNota(n)}
                >
                  <div>{n.titulo}</div>
                  <div className="nota-fecha">
                    {n.fechaCreacion?.toDate().toLocaleString()}
                  </div>
                  <div className="nota-acciones">
                    <button onClick={(e) => { e.stopPropagation(); eliminarNota(n.id); }}>Eliminar</button>
                    <button onClick={(e) => { e.stopPropagation(); cargarNota(n); }}>Editar</button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="notas-vista">
          {vistaNota ? (
            <div className="vista-activa">
              {modoEdicionVista ? (
                <>
                  <input
                    className="input-hacker"
                    type="text"
                    value={edicionTitulo}
                    onChange={(e) => setEdicionTitulo(e.target.value)}
                  />
                  <textarea
                    className="textarea-hacker"
                    value={edicionContenido}
                    onChange={(e) => setEdicionContenido(e.target.value)}
                  />
                  <div style={{ marginTop: 'auto' }}>
                    <button className="btn-hacker" onClick={actualizarDesdeVista}>Guardar cambios</button>
                    <button className="btn-hacker" onClick={() => setModoEdicionVista(false)}>
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="titulo-hacker">{vistaNota.titulo}</h2>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{vistaNota.contenido}</p>
                  <p className="nota-fecha">Última edición: {vistaNota.ultimaEdicion?.toDate().toLocaleString()}</p>
                  {vistaNota.importante && <p className="importante-alerta">⚠️ Importante</p>}
                  <div style={{ marginTop: 'auto' }}>
                    <button className="btn-hacker" onClick={() => setModoEdicionVista(true)}>Editar</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="no-vista">Haz clic en una nota para verla completa aquí</p>
          )}
        </div>
      </div>
    </div>
  );
}
