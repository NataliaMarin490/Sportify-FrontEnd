import "../Styles/cards.css";
import { Link } from "react-router-dom";
import "../Styles/cards.css";
import PropTypes from "prop-types";
import FavoriteButton from "./FavoriteButton.jsx";
import { useState, useEffect } from "react";

const Cards = ({ court }) => {
  Cards.propTypes = {
    court: PropTypes.shape({
      name: PropTypes.string.isRequired,
      sport: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      imageUrl: PropTypes.arrayOf(PropTypes.string).isRequired, // Debería ser un arreglo de URLs
      features: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  };

  const { name, sport, city, id, features } = court;

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Evita que se active el Link
    console.log("Botón de favorito clickeado");
  };

  return (
    <div className="cards-container">
      <div className="card-image-container">
        <img className="card-image" src={court.imageUrl[0]} alt={name} />
        {/* El botón de favoritos se coloca sobre la imagen */}
        <div onClick={handleFavoriteClick} className="card-favorite">
          <FavoriteButton product={court} />
        </div>
      </div>

      <div className="card-description-container">
        <h3 className="cards-title">{sport}</h3>
        <h4 className="cards-text">
          <i className="fa-solid fa-location-dot"></i> {city}
        </h4>
        <h4 className="card-name">{name}</h4>
        {features.slice(0, 3).map((prop, id) => (
          <div key={id} className="card-properties-container">
            <i className="fa-solid fa-circle-check"></i>
            <p className="cards-text">{prop}</p>
          </div>
        ))}
      </div>
      <Link to={`/detail/${id}`} className="link-button-container">
        <button className="card-button">Ver más</button>
      </Link>
    </div>
  );
};

export default Cards;
