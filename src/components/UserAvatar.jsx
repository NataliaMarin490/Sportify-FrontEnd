import React, { useEffect, useState, useRef} from "react";
import "../Styles/userAvatar.css"; // Estilos personalizados para el componente
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useContextGlobal } from "../Context/global.context";

const UserAvatar = ({ userName, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContextGlobal();
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const menuRef = useRef(null);

  // Función para obtener las iniciales del usuario con validación
  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?"; // Si name es undefined o no es string, devuelve "?"
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleGlobalClick = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("click", handleGlobalClick);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [isMenuOpen]);


  return (
    <div className="user-avatar-container">
    {/* Avatar con iniciales */}
    <div 
      className="user-avatar" 
      onClick={handleAvatarClick}
      ref={avatarRef}
    >
      {getInitials(userName)}
    </div>

    {/* Menú desplegable */}
    {isMenuOpen && (
      <div className="dropdown-menu" ref={menuRef}>
        <div>
          <div className="detail-menu">
            <div className="link" onClick={() => handleLinkClick("/profile")}>
              <img src="/icons/user-perfil-icon-2.svg" alt="perfil" />
              <span>Ver Perfil</span>
            </div>
          </div>
          
          {(user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN") && (
            <div className="detail-menu">
              <div className="link" onClick={() => handleLinkClick("/administracion")}>
                <img src="/icons/panel-admin-icon-2.svg" alt="perfil" />
                <span>Panel Admin</span>
              </div>
            </div>
          )}
          
          <div className="detail-menu">
            <div className="link" onClick={() => handleLinkClick("/user-booking-history")}>
              <img src="/icons/list.svg" alt="perfil" />
              <span>Mis Reservas</span>
            </div>
          </div>
          
          <div className="detail-menu">
            <div 
              className="link" 
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
            >
              <img src="/icons/log-out-icon-2.svg" alt="cerrar sesión" />
              <span>Cerrar sesión</span>
            </div>
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
