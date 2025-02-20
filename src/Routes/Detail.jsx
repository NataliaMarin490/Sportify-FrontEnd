import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CalendarWithTime from "../components/Calendar";
import ReviewStars from "../components/Reviews";
import BookingForm from "../components/BookingForm";
import Map from "../components/Map";
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
      <div className="detail-container">
        <div className="detail">
          <div className="product">
            <img className="image-detail" src={recipe.image} alt="" />
            <h4 className="title-product"> {recipe.title}</h4>
            <div className="InfoProduct">
              <h4 className="title-product"> $ </h4>
              <p>{recipe.pricePerServing}</p>
            </div>
            <div className="contenedor-detail-product">
              <div className="details-product">
                <h4 className="title-product"> Categoria: </h4>
                <p>{recipe.pricePerServing}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Ciudad: </h4>
                <p>{recipe.pricePerServing}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Descripción: </h4>
                <p>{recipe.pricePerServing}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Capacidad: </h4>
                <p>{recipe.pricePerServing}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Dirección: </h4>
                <p>{recipe.pricePerServing}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Localidad: </h4>
                <p>{recipe.pricePerServing}</p>
              </div>
            </div>
          </div>
          <CalendarWithTime />
        </div>
        <div className="detail-extra-info">
          <ReviewStars />
          <BookingForm />
        </div>
        <Map />
      </div>
    </>
  );
};

export default Detail;
