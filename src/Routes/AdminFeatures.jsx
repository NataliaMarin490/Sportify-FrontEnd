import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/adminCourts.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config";

const AdminFeatures = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar datos desde la API
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/features`)
      .then((response) => {
        setFeatures(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las características:", error);
        alert("Hubo un error al cargar los datos.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrar resultados por búsqueda
  const filteredFeatures = features.filter((feature) =>
    feature.feature.toLowerCase().includes(search.toLowerCase())
  );

  // Eliminar una característica
  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que quieres desactivar esta característica?")) {
      axios
        .put(`${API_BASE_URL}/features/${id}/deactivate`)
        .then(() => {
          setFeatures(features.filter((f) => f.idFeature !== id));
          alert("Característica desactivada exitosamente.");
        })
        .catch((error) => {
          console.error("Error al desactivar la característica:", error);
          alert("Hubo un error al desactivar la característica.");
        });
    }
  };

  // Editar una característica (redirección a la vista de edición)
  const handleEdit = (id) => {
    navigate(`/edit-feature/${id}`);
  };

  return (
    <div className="admin-view">
      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar característica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button
          onClick={() => navigate("/create-feature")}
          className="create-btn"
        >
          Agregar característica
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Característica</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                Cargando...
              </td>
            </tr>
          ) : filteredFeatures.length > 0 ? (
            filteredFeatures.map((feature) => (
              <tr key={feature.idFeature}>
                <td>{feature.idFeature}</td>
                <td>{feature.feature}</td>
                <td>
                  <img
                    src={feature.imageUrl}
                    alt={feature.feature}
                    className="feature-image"
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(feature.idFeature)}
                    className="icon-btn"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(feature.idFeature)}
                    className="icon-btn delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No se encontraron características.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFeatures;
