import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import "../Styles/reviews.css";

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

const Reviews = ({ reviews }) => {
  console.log(reviews);
  return (
    <section className="reviews-container">
      <div className="review-container">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-calif">
                <div className="review-data">
                  <h4 className="review2">{review.userName}</h4>
                  <p>
                    {review.date
                      ? new Date(review.date).toLocaleDateString("es-ES") // Esto formatea la fecha en formato "dd/mm/yyyy"
                      : "No disponible"}
                  </p>
                </div>
                <div className="rating">
                  <p>{review.rating}</p>
                  <ReviewStars rating={review.rating} />
                </div>
              </div>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No hay reseñas para esta cancha.</p>
        )}
      </div>
    </section>
  );
};

export default Reviews;
