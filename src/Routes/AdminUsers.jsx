import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../Styles/adminUsers.css";
import { useContextGlobal } from "../Context/global.context";
/* import { useNavigate } from "react-router-dom"; */
import { FaUserShield, FaUserSlash, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config";

const AdminUsers = () => {
  const { state, dispatch } = useContextGlobal();
  /* const navigate = useNavigate(); */
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* useEffect(() => {
    if (window.innerWidth < 890) {
      document.body.innerHTML =
        "<h2 style='text-align:center; padding: 50px;'>Esta página solo está disponible en versión de escritorio.</h2>";
    }
  }, []); */

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      dispatch({ type: "SET_USERS", payload: response.data });
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      alert("Hubo un error al obtener la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!state.users || state.users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, state.users]);

  const toggleAdminPermission = (userId, isAdmin) => {
    const action = isAdmin ? "revoke" : "grant";
    if (
      window.confirm(
        `¿Estás seguro de que quieres ${isAdmin ? "revocar" : "otorgar"} permisos de administrador a este usuario?`
      )
    ) {
      setLoading(true);
      axios
      .put(`${API_BASE_URL}/users/${action}-admin/${userId}`)
      .then(() => {
      fetchUsers(); 
      alert(`Permisos de administrador ${isAdmin ? "revocados" : "otorgados"} exitosamente.`);
    })
        .catch((error) => {
          console.error("Error al cambiar permisos de administrador:", error);
          alert("Hubo un error al actualizar los permisos.");
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="admin-view">
      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(state.users || [])
              .filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "Administrador" : "Usuario"}</td>
                  <td>
                    <button
                      onClick={() => toggleAdminPermission(user.id, user.isAdmin)}
                      disabled={loading}
                      className="icon-btn"
                    >
                      {user.isAdmin ? <FaUserSlash /> : <FaUserShield />}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default AdminUsers;
