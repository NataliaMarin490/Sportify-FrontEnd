import "../Styles/cards.css";
import { Link } from "react-router-dom";
import "../Styles/cards.css";

const Cards = ({ court }) => {
  const { name, sport, city, id } = court;

  return (
    <div className="cards-container">
      <Link to={`/detail/${id}`}>
       {/*  <img className="fields" src={image} alt={title} /> */}
        <h3>{name}</h3>
        <h4>${sport}</h4>
        <h4>${city}</h4>
      </Link>
    </div>
  );
};

export default Cards;
