import React, { useState } from "react";
import "../Styles/favoriteAvatar.css"; // Estilos personalizados para el componente
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const FavoriteAvatar = () => {
  const location = useLocation();
  const isFavoritePage = location.pathname === "/favorites";

  return (
    <div className="fav-avatar-container">
      <Link to="/favorites">
        {isFavoritePage ? (
          <img
            src="public\icons\favorito-menu-header-blanco-icono.svg"
            alt="fav-heart"
            className="fav-avatar"
          />
        ) : (
          <img
            src="public\icons\favorito-menu-header-verde-icono.svg"
            alt="fav-heart"
            className="fav-avatar"
          />
        )}
      </Link>
    </div>
  );
};

export default FavoriteAvatar;
