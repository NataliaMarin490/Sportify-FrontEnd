import "../Styles/cards.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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

  const { name, sport, city, id, features, imageUrl } = court;

  // Verificamos si imageUrl es un arreglo y tiene al menos un elemento
  const imageSrc = Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : "ruta/por-defecto.jpg"; // imagen por defecto si no hay imagen

  return (
    <Link to={`/detail/${id}`}>
      <div className="cards-container">
        <div className="card-image-container">
          <img className="card-image" src={imageSrc} alt={name} />
        </div>
        <div className="card-description-container">
          <h3 className="cards-title">{sport}</h3>
          <h4 className="cards-text">
            <i className="fa-solid fa-location-dot"></i> {city}
          </h4>
          <h4 className="card-name">{name}</h4>
          {features.slice(0, 3).map((prop, index) => (
            <div key={index} className="card-properties-container">
              <i className="fa-solid fa-circle-check"></i>
              <p className="cards-text">{prop}</p>
            </div>
          ))}
        </div>
        <button className="card-button">Ver más</button>
      </div>
    </Link>
  );
};

export default Cards;
