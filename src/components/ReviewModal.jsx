import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import "../Styles/userBookingHistory.css";

// Review Modal Component
const ReviewModal = ({ booking, initialReview, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [comment, setComment] = useState(initialReview?.comment || "");

  // Manejar el envío de la reseña
  const handleSubmit = () => {
    // Llamamos a la función onSubmit pasando el courtId, bookingId, rating y comment
    onSubmit(booking.courtId, booking.idBooking, rating, comment);
  };

  return (
    <div className="modal-overlay">
      <div className="review-modal">
        <button className="close-modal" onClick={onCancel}>
          <FaTimes />
        </button>

        <h3>Deja aquí tu experiencia para la reserva: {booking.courtName}</h3>

        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer" }}
            >
              {star <= rating ? <FaStar color="gold" /> : <FaRegStar />}
            </span>
          ))}
        </div>

        <textarea
          placeholder="Escribe tu comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <div className="review-modal-actions">
          <button className="submit-review" onClick={handleSubmit}>
            Publicar
          </button>
          <button className="cancel-review" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
