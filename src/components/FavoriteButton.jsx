import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Asegúrate de usar estos iconos correctamente
import "../Styles/favoriteButton.css";

const FavoriteButton = ({ product }) => {
  // Estado para saber si el producto está en favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  // Efecto para recuperar el estado de favoritos desde localStorage cuando el componente se monta
  useEffect(() => {
    if (product && product.id) {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

      const isProductFavorite = storedFavorites.some(
        (fav) => String(fav.id) === String(product.id) // Comparar correctamente usando product.id
      );
      setIsFavorite(isProductFavorite);
    }
  }, [product]);

  // Función para manejar la acción de agregar o quitar de favoritos
  const toggleFavorite = () => {
    if (product && product.id) {
      const storedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

      let updatedFavorites;

      if (isFavorite) {
        // Si el producto ya está en favoritos, eliminarlo
        updatedFavorites = storedFavorites.filter(
          (fav) => String(fav.id) !== String(product.id) // Comparar correctamente usando product.id
        );
      } else {
        // Si el producto no está en favoritos, agregarlo
        updatedFavorites = [...storedFavorites, product];
      }
      console.log("updatedFavorites:", updatedFavorites); // Verifica cómo se actualiza la lista
      // Actualizar el estado local de favoritos
      setIsFavorite(!isFavorite);
      // Guardar la nueva lista de favoritos en localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
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
