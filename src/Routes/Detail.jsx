import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CalendarWithTime from "../components/Calendar";
import ReviewStars from "../components/Reviews";
import BookingForm from "../components/BookingForm";
import Map from "../components/Map";
import "../Styles/detail.css";
import ImageGallery from "../components/ImageGallery";
import BackButton from "../components/BackButton";
import { useContextGlobal } from "../Context/global.context";

const Detail = () => {

  const { state } = useContextGlobal();
  const { id } = useParams();
  console.log("Estado antes de actualizar:", state.courts);

  const product =
    state.courts && Array.isArray(state.courts)
      ? state.courts.find((item) => item.id === parseInt(id)) // Convertir id a número
      : null;


  return (
    <>
      <div className="detail-container">
        <div className="detail">
          <div className="product">
            <div className="galeria">
              <img
                className="image-detail"
                src={product.image}
                alt={product.name}
              />
              <ImageGallery />
            </div>
            <span className="contenedor-titulo">
              <h4 className="title-product"> {product.name}</h4>
            </span>

            <div className="InfoProduct">
              <h4 className="title-product"> $ </h4>
              <p>{product.pricePerHour}</p>
            </div>
            <div className="contenedor-detail-product">
              <div className="details-product">
                <h4 className="title-product"> Categoria: </h4>
                <p>{product.sport}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Ciudad: </h4>
                <p>{product.city}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Descripción: </h4>
                <p>{product.description}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Capacidad: </h4>
                <p>{product.capacity}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Dirección: </h4>
                <p>{product.address}</p>
              </div>
              <div className="details-product">
                <h4 className="title-product"> Localidad: </h4>
                <p>{product.neighborhood}</p>
              </div>
            </div>
          </div>
          <CalendarWithTime />
          <span className="aling-body">
            <BackButton />
          </span>
        </div>
        <div className="detail-extra-info">
          <ReviewStars />
          <BookingForm />
        </div>
        <div className="Mapa">
          <Map />
        </div>
      </div>
    </>
  );
};

export default Detail;
