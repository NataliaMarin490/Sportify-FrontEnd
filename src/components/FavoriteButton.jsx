import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Asegúrate de usar estos iconos correctamente
import "../Styles/favoriteButton.css";
import API_BASE_URL from "../config";

const FavoriteButton = ({ product }) => {
  // Estado para saber si el producto está en favoritos
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Efecto para recuperar el estado de favoritos desde localStorage cuando el componente se monta
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;
  
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (token && product?.id) {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/favorites/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error("Error al obtener la lista de favoritos");
        }
  
        const data = await response.json();
        
        // 🔥 Verifica si el producto está en la lista de favoritos
        const isProductFavorite = data.some(fav => fav.idCourt === product.id);
        setIsFavorite(isProductFavorite);
  
      } catch (error) {
        console.error("Error obteniendo favoritos:", error);
      }
    };
  
    if (product?.id) {
      fetchFavorites();
    }
  }
  }, [product]);
  
  

  // Función para manejar la acción de agregar o quitar de favoritos
  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para marcar favoritos.");
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.token;
  
      if (!token) {
        console.error("No hay token disponible");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/favorites/${product.id}/toggle`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar favorito");
      }
  
      // Alternar el estado local
      setIsFavorite(!isFavorite);
  
      // 🔥 Refrescar la lista en `FavoritesPage`
      if (typeof window.fetchFavorites === "function") {
        window.fetchFavorites();
      }
    } catch (error) {
      console.error("Error actualizando favorito:", error);
    }
  };

  return (
    <button
      className={`favorite-button ${isFavorite ? "favorited" : ""}`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
    </button>
  );
};

export default FavoriteButton;
