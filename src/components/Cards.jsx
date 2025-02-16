import { useState } from "react";
import "../Styles/cards.css";
import { Link, useLocation } from "react-router-dom";
import { useRecipeStates } from "../Context/COntext";
import "../Styles/cards.css";

const Cards = ({ recipe }) => {
  const { title, image, pricePerServing, id } = recipe;
  const [counter, setCounter] = useState(0);
  const { dispatch } = useRecipeStates(); //Llamo al set desde el context
  const location = useLocation(); //Herramienta que uso para saber en que página se renderiza la card
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
