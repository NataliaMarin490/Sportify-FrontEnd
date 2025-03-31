import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config";
import "../Styles/admin.css";

const AdminCategories = () => {
  const navigate = useNavigate();
  const [sports, setSports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/public/sports/status/5`)
      .then((response) => setSports(response.data))
      .catch((error) => {
        console.error("Error al cargar los deportes:", error);
        alert("Hubo un error al cargar los datos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
      axios
        .put(`${API_BASE_URL}/public/sports/update-status/${id}`)
        .then((response) => {
          const message = response.data?.[0]?.Message || response.data;

          if (message === "Deporte eliminado correctamente.") {
            alert(message);
            setSports((prevSports) =>
              prevSports.filter((sport) => sport.id !== id)
            );
          } else {
            alert(message);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar deporte: ", error);
          alert("Hubo un error al eliminar deporte.");
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`);
  };

  const filteredSports = sports.filter((sport) =>
    sport.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-view">
      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button onClick={() => navigate("/create-categories")} id="create-btn">
          Agregar categorías
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Icono</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5">Cargando...</td>
            </tr>
          ) : filteredSports.length > 0 ? (
            filteredSports.map((sport) => (
              <tr key={sport.id}>
                <td>{sport.id}</td>
                <td>{sport.name}</td>
                <td>
                  <i className={`fa ${sport.icon} category-icon-admin`}></i>
                </td>
                <td>{sport.description}</td>
                <td>
                  <button onClick={() => handleEdit(sport.id)}
                    className="icon-btn">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(sport.id)}
                    className="icon-btn"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron categorías.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategories;
