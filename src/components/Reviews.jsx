import React, { useState } from "react";
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

  const [showModal, setShowModal] = useState(false);

  // Función para cerrar el modal al hacer clic fuera de él
  const closeModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowModal(false);
    }
  };

  // Limitar a 4 reseñas máximo
  const limitedReviews = reviews.slice(0, 2);

  return (
    <section className="reviews-container">
      <div className="review-container">
        {limitedReviews.length > 0 ? (
          limitedReviews.map((review) => (
            <div key={review.idBooking} className="review-card">
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
                  {/* <p>{review.rating}</p> */}
                  <ReviewStars rating={review.rating} />
                </div>
              </div>
              <p className="review-msg">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No hay reseñas para esta cancha.</p>
        )}

        {/* Mostrar botón "Ver todas" solo si hay más de 2 reseñas */}
        {reviews.length > 2 && (
          <button className="btn-view-all" onClick={() => setShowModal(true)}>
            Ver todas
          </button>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <h2>Todas las reseñas</h2>
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ✖
            </button>

            <div className="modal-reviews">
              {reviews.map((review) => (
                <div key={review.idBooking} className="review-card">
                  <div className="review-card-calif">
                    <div className="modal-review-data">
                      <h4 className="review2">{review.userName}</h4>
                      <p>
                        {review.date
                          ? new Date(review.date).toLocaleDateString("es-ES")
                          : "No disponible"}
                      </p>
                    </div>
                    <div className="rating">
                      {/* <p>{review.rating}</p> */}
                      <ReviewStars rating={review.rating} />
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
