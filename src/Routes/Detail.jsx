import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Calendario from "../components/Calendario";
import ReviewStars from "../components/Reseñas";
import Form from "../components/FormReserva";
import Mapa from "../components/Mapa";
import "../Styles/detail.css";

const Detail = () => {
  const [recipe, setRecipe] = useState({});
  const params = useParams();
  console.log(params);

  const url = `https://api.spoonacular.com/recipes/${
    params.id
  }/information?apiKey=${import.meta.env.VITE_API_KEY}`;

  useEffect(() => {
    axios(url)
      .then(({ data }) => {
        console.log(data);
        setRecipe(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="detailContenedor">
        <div className="detail">
          <div className="Producto">
            <img className="imagen" src={recipe.image} alt="" />
            <h4>{recipe.title}</h4>
            <p>{recipe.pricePerServing}</p>
          </div>
          <Calendario />
        </div>
        <div className="contenedor2">
          <ReviewStars />
          <Form />
        </div>
        <Mapa />
      </div>
    </>
  );
};

export default Detail;
