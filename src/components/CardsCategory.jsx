import "../Styles/cardsCategory.css";
import { Link } from "react-router-dom";

const CardsCategory = ({ recipe }) => {
  const { title, image, pricePerServing, id } = recipe;

  return (
    <div className="cards-category-container">
      <Link className="link-container" to={`/detail/${id}`}>
        <img className="category-fields" src={image} alt={title} />
        <h3>{title}</h3>
        <p>${pricePerServing}</p>
        <button className="book-button">RESERVA AQUÍ</button>
      </Link>
    </div>
  );
};

export default CardsCategory;
