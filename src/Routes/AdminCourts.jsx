import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/admin.css";
import { useContextGlobal } from "../Context/global.context";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config";

const AdminCourts = () => {
  const { state, dispatch } = useContextGlobal();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const [courts, setCourts] = useState([]);
  const itemsPerPage = 10; // Cuántos elementos por página
  const totalPages = state?.courts?.totalPages || 1;

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
      if (window.innerWidth <= 700 && window.innerHeight <= 900) {
        alert("Acceso restringido a esta vista.");
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    // Aquí simulas la carga de canchas al cambiar de página
    axios
      .get(
        `${API_BASE_URL}/courts/search?page=${currentPage}&size=${itemsPerPage}`
      )
      .then((response) => {
        setCourts(response.data.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de las canchas:", error);
      });
  }, [currentPage]);

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta cancha?")) {
      axios
        .put(`${API_BASE_URL}/courts/delete/${id}`)
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
    navigate(`/edit-court/${id}`);
  };

  const handleFetchNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(nextPage);
  };

  const handleFetchPrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    setCurrentPage(prevPage);
  };

  return (
    <div className="admin-view">
      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <button onClick={() => navigate("/create-court")} id="create-btn">
          Agregar cancha
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
          {courts?.map((court) => (
            <tr key={court.id}>
              <td>{court.id}</td>
              <td>{court.name}</td>
              <td>
                <button
                  onClick={() => handleEdit(court.id)}
                  className="icon-btn"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(court.id)}
                  className="icon-btn"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handleFetchPrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleFetchNextPage}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AdminCourts;
