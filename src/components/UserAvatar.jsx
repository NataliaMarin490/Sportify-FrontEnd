import React, { useState } from "react";
import "../Styles/userAvatar.css"; // Estilos personalizados para el componente
import { Link } from "react-router-dom";

const UserAvatar = ({ userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para obtener las iniciales del usuario
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join(""); // Obtiene las primeras letras de cada parte del nombre
    return initials;
  };

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen); // Alterna el estado del menú
  };

  //funcion para cierre de sesion
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
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
                <img src="public\icons\user.png" alt="perfil" />
                <span>Ver Perfil</span>
              </Link>
            </div>
            <div className="detail-menu">
              <Link className="link" to="/administrador">
                <img
                  src="public\icons\database-data-base-config-cog-options-svgrepo-com 1.png"
                  alt="perfil"
                />
                <span>Panel Admin</span>
              </Link>
            </div>
            <div className="detail-menu" onClick={handleLogout}>
              <Link className="link" to="/login">
                <img src="public\icons\log-out.png" alt="perfil" />
                <span>Cerrar sesión</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
