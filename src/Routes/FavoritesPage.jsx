import React, { useState, useEffect } from "react";
import "../Styles/favoritesPage.css";
import { FaSearch } from "react-icons/fa";
import { LiaHeartBrokenSolid } from "react-icons/lia";
import BackButton from "../components/BackButton.jsx";

const FavoritesPage = () => {
  // Usar el estado para la lista de favoritos y la búsqueda
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");

  // Cargar los favoritos desde el localStorage cuando el componente se monta
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Función para agregar un favorito
  const addFavorite = (item) => {
    const updatedFavorites = [...favorites, item];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Guardar en localStorage
  };

  // Función para eliminar un favorito
  const removeFavorite = (item) => {
    const updatedFavorites = favorites.filter(
      (favorite) => favorite.id !== item.id
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Guardar en localStorage
  };

  // Filtrar favoritos según la búsqueda
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.description.toLowerCase().includes(search.toLowerCase()) || // Filtra por la descripción
    favorite.name.toLowerCase().includes(search.toLowerCase()) // Filtra por el nombre (si tienes un campo 'name')
  );

  return (
    <div className="container-fav">
      <BackButton className="back-button-fav"/>
      <div className="subcontainer-fav">
        <div className="container-detail-fav">
          <span className="title-fav">Favoritos</span>
          <p className="text-fav">Administra aquí tus canchas favoritas</p>
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="container-details-fav">
            {filteredFavorites.length > 0 ? (
              <table className="favorites-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>CANCHA</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFavorites.map((favorite) => (
                    <tr key={favorite.id}>
                      <td>
                        <img
                          src={favorite.imageUrl}
                          alt={favorite.name}
                          width="50"
                        />
                      </td>
                      <td>{favorite.description}</td>
                      <td>
                        <button
                          className="button-fav"
                          onClick={() => removeFavorite(favorite)}
                        >
                          <LiaHeartBrokenSolid size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No tienes favoritos guardados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
