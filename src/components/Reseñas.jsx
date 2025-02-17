import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import "../Styles/reseñas.css";

const reviews = [
  {
    id: 1,
    name: "Carlos Pérez",
    rating: 5,
    comment: "¡Excelente servicio! Muy recomendado.",
  },
  {
    id: 2,
    name: "María Gómez",
    rating: 4,
    comment: "Muy buena experiencia, pero se puede mejorar.",
  },
  {
    id: 3,
    name: "Juan López",
    rating: 3,
    comment: "El servicio estuvo bien, pero esperaba más.",
  },
];

const ReviewStars = ({ rating }) => {
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) =>
        i < rating ? (
          <FaStar key={i} className="star-filled" />
        ) : (
          <FaRegStar key={i} className="star-empty" />
        )
      )}
    </div>
  );
};

const Reviews = () => {
  return (
    <section className="reviews-container">
      <h2  className="reseña">Opiniones de Nuestros Clientes</h2>
      <div className="contenedor-reviews">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h4  className="reseña2">{review.name}</h4>
            <ReviewStars rating={review.rating} />
            <p>Calificación: {review.rating}/5</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
