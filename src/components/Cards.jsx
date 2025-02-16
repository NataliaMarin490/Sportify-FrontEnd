import "../Styles/cards.css";
import { Link } from "react-router-dom";
import "../Styles/cards.css";

const Cards = ({ recipe }) => {
  const { title, image, pricePerServing, id } = recipe;
  console.log(recipe);

  return (
    <div className="Contenedor">
      <Link to={`/detail/${id}`}>
        <img className="canchas" src={image} alt={title} />
        <h3>{title}</h3>
        <h4>${pricePerServing}</h4>
      </Link>
    </div>
  );
};

export default Cards;
