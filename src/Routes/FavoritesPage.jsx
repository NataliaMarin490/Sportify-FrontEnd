import React, { useState, useEffect } from "react";
import "../Styles/favoritesPage.css";
import { FaSearch } from "react-icons/fa";
import { LiaHeartBrokenSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import API_BASE_URL from "../config";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const token = user?.token; 

      if (!token) {
        console.error("No hay token disponible");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/favorites/all`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al obtener favoritos");

      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (courtId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/favorites/${courtId}/toggle`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar favorito");
      }

      fetchFavorites();
    } catch (error) {
      console.error("Error actualizando favorito:", error);
    }
  };

  const goToDetail = (idCourt) => {
    navigate(`/detail/${idCourt}`);
  };

  const filteredFavorites = favorites.filter(
    (favorite) =>
      favorite.courtDescription.toLowerCase().includes(search.toLowerCase()) ||
      favorite.courtName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fav">
      <BackButton className="back-button-fav" />
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
                    <tr key={favorite.idCourt}>
                      <td>
                        <img
                          src={favorite.imageUrl}
                          alt={favorite.courtName}
                          width="50"
                          style={{ cursor: "pointer" }}
                          onClick={() => goToDetail(favorite.idCourt)}
                        />
                      </td>
                      <td
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => goToDetail(favorite.idCourt)}>
                        {favorite.courtName}</td>
                      <td>
                        <button
                          className="button-fav"
                          onClick={() => toggleFavorite(favorite.idCourt)}
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
