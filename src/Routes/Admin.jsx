import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/admin.css";
import { useContextGlobal } from "../Context/global.context";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Admin = () => {
  const { state, dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  function checkScreenSize() {
    if (window.innerWidth < 890) {
      document.body.innerHTML =
        "<h2 style='text-align:center; padding: 50px;'>Esta página solo está disponible en versión de escritorio.</h2>";
    }
  }

  window.onload = checkScreenSize;
  window.onresize = checkScreenSize;

  useEffect(() => {
    if (window) {
      console.log(window.innerWidth, window.innerHeight);
      if (window.innerWidth <= 700 && window.innerHeight <= 900) {
        alert("Acceso restringido a esta vista.");
        navigate("/");
      }
    }
  }, [navigate]);
  const [loading, setLoading] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cancha?")) {
      axios
        .put(`http://localhost:8080/api/courts/delete/${id}`)
        .then(() => {
          dispatch({ type: "DELETE_COURT", payload: id });
          alert("La cancha ha sido eliminada exitosamente.");
        })
        .catch((error) => {
          console.error("Error al eliminar la cancha:", error);
          alert("Hubo un error al eliminar la cancha.");
        });
    }
  };

  const handleEdit = (id) => {
    console.log("Editar court con ID:", id);
    dispatch({ type: "UPDATE_COURT", payload: id });
  };

  return (
    <div className="admin-view">
      <h1>Admin Panel</h1>
      <div className="top-bar">
      <button
          onClick={() => navigate("/create-court")}
          className="create-btn"
        >
          Crear
        </button>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" /> {/* Ícono de búsqueda */}
        </div>
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
                <button
                  onClick={() => handleEdit(court.id)}
                  disabled={loading}
                  className="icon-btn"
                >
                  <FaEdit /> {/* Icono de editar */}
                </button>
                <button
                  onClick={() => handleDelete(court.id)}
                  className="icon-btn"
                >
                  <FaTrash /> {/* Icono de eliminar */}
                </button>
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
