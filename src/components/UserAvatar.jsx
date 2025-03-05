import React, { useState } from "react";
import "../Styles/userAvatar.css"; // Estilos personalizados para el componente
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const UserAvatar = ({ userName, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para obtener las iniciales del usuario con validación
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?"; // Si name es undefined o no es string, devuelve "?"
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna el estado del menú
  };

  return (
    <div className="user-avatar-container">
      {/* Avatar con iniciales */}
      <div className="user-avatar" onClick={handleAvatarClick}>
        {getInitials(userName)}
      </div>

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          <div>
            <div className="detail-menu">
              <Link className="link" to="/profile">
                <img src="/icons/user.png" alt="perfil" />
                <span>Ver Perfil</span>
              </Link>
            </div>
            <div className="detail-menu">
              <Link className="link" to="/administracion">
                <img
                  src="/icons/database-data-base-config-cog-options-svgrepo-com-1.png"
                  alt="perfil"
                />
                <span>Panel Admin</span>
              </Link>
            </div>
            <div className="detail-menu" onClick={onLogout}>
              <Link className="link" to="/login">
                <img src="/icons/log-out.png" alt="cerrar sesión" />
                <span>Cerrar sesión</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


UserAvatar.propTypes = {
  userName: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default UserAvatar;
