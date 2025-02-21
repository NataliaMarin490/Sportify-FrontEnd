import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/admin.css";
import { useContextGlobal } from "../Context/global.context";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { state, dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (window) {
      console.log(window.innerWidth, window.innerHeight);
      if (window.innerWidth <= 700 && window.innerHeight <= 900) {
        alert("Acceso restringido a esta vista.");
        navigate('/');
      }
    }
  }, [navigate]);

  const handleDelete = (id) => {
    dispatch({ type: "DELETE_COURT", payload: id });
  };

  const handleEdit = (id) => {
    console.log("Editar court con ID:", id);
    dispatch({ type: "UPDATE_COURT", payload: id });
  };

  return (
    <div className="admin-view">
      <h1>Admin Panel</h1>
      <div className="top-bar">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => navigate("/create-court")}
          className="create-btn"
        >
          Crear
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {state.courts.map((court) => (
            <tr key={court.id}>
              <td>{court.id}</td>
              <td>{court.name}</td>
              <td>
                <button onClick={() => handleEdit(court.id)}>Editar</button>
                <button onClick={() => handleDelete(court.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button onClick={handleAdd}>Agregar Nueva Receta</button> */}
    </div>
  );
};

export default Admin;
