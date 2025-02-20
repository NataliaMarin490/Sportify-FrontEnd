import "../Styles/cards.css";
import { Link } from "react-router-dom";
import "../Styles/cards.css";
import PropTypes from "prop-types";
import image from "../../public/icons/image 7.png";

const Cards = ({ court }) => {
  Cards.propTypes = {
    court: PropTypes.shape({
      name: PropTypes.string.isRequired,
      sport: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }).isRequired,
  };

  const { name, sport, city, id } = court;

  return (
    <Link to={`/detail/${id}`}>
      <div className="cards-container">
        <img className="fields" src={image} alt={name} />
        <h3 className="cards-title">{name}</h3>
        <h4 className="cards-text">${sport}</h4>
        <h4 className="cards-text">${city}</h4>
      </div>
    </Link>
  );
};

export default Cards;
