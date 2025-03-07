import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/admin.css";
import { FaUserShield, FaUserCog, FaSearch } from "react-icons/fa";
import API_BASE_URL from "../config";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/users/all`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los usuarios:", error);
        alert("Hubo un error al cargar los datos.");
      })
      .finally(() => setLoading(false));
  };

  const updateUserRole = async (userId, newRole) => {
    if (
      !window.confirm(
        `¿Seguro que deseas cambiar el rol del usuario a ${newRole}?`
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/roles/update/${userId}?newRole=${newRole}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Rol actualizado correctamente");
      fetchUsers();
    } catch (error) {
      console.error("Error al actualizar el rol:", error);
      alert("No se pudo actualizar el rol");
    } finally {
      setLoading(false);
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
              <th>Nombre(s)</th>
              <th>Apellido(s)</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles.includes("ROLE_SUPER_ADMIN")
                      ? "Superadministrador"
                      : user.roles.includes("ROLE_ADMIN")
                      ? "Administrador"
                      : "Cliente"}
                  </td>
                  <td>
                    {user.roles.includes("ROLE_SUPER_ADMIN") ? (
                      <span>-</span>
                    ) : (
                      <button
                        onClick={() =>
                          updateUserRole(
                            user.id,
                            user.roles.includes("ROLE_ADMIN")
                              ? "ROLE_USER"
                              : "ROLE_ADMIN"
                          )
                        }
                        disabled={loading}
                        className="access-icon"
                      >
                        {user.roles.includes("ROLE_ADMIN") ? (
                          <FaUserCog />
                        ) : (
                          <FaUserShield />
                        )}
                      </button>
                    )}
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
