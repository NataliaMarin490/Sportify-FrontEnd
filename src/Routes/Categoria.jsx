import React from "react";
import Imagen from "../components/ImagenCategoria";
import "../Styles/Categoria.css";
import { useRecipeStates } from "../Context/COntext";
import CardsCategoria from "../components/CardsCategoria";

const Categoria = () => {
  const { state } = useRecipeStates();

  return (
    <div className="ContenedorPpalCate">
      <Imagen />
      <div className="searcherCat">
        <input name="address" type="text" placeholder="Dirección" />
        <input name="sport" type="text" placeholder="Deporte" />
        <input name="day" type="text" placeholder="Fecha" />
        <input name="hour" type="number" placeholder="Hora" />
        <button>Buscar</button>
      </div>
      <div className="ContenedorCards">
        {state.recipes.map((recipe) => (
          <CardsCategoria key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Categoria;
