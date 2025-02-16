import "../Styles/cardsCatego.css";
import { Link } from "react-router-dom";

const Cards = ({ recipe }) => {
  const { title, image, pricePerServing, id } = recipe;
  console.log(recipe);

  return (
    <div className="ContenedorCardsCat">
      <Link className="ContenedorEnlace" to={`/detail/${id}`}>
        <img className="canchasCate" src={image} alt={title} />
        <h3>{title}</h3>
        <p>${pricePerServing}</p>
        <button className="boton">RESERVA AQUÍ</button>
      </Link>
    </div>
  );
};

export default Cards;
