import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar,  FaRegStar, FaTimes} from "react-icons/fa";
import "../Styles/userBookingHistory.css";
import BackButton from "../components/BackButton";
import API_BASE_URL from "../config";


const UserBookingHistory = () => {
  const [courts, setCourts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourt, setCurrentCourt] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  const url = `${API_BASE_URL}/public/courts/search?page=1&size=10`;

  useEffect(() => {
    axios(url)
      .then((res) => {
        setCourts(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
        setError(err.message);
      });
  }, []);

  const handleStarClick = (court) => {
    setCurrentCourt(court);
    setIsModalOpen(true);
  };

  const handleSubmitReview = () => {
    // Aquí puedes enviar la reseña al backend
    console.log({
      courtId: currentCourt.id,
      rating,
      comment
    });
    
    // Cerrar el modal y resetear los valores
    setIsModalOpen(false);
    setRating(0);
    setComment("");
  };

  return (
    <div className="background-container">
      <BackButton />
      <div className="booking-history-container">
        <div className="div-tittle">
          <h3>HISTORIAL DE RESERVAS</h3>
          <span>Accede aquí al historial de tus reservas</span>
        </div>

        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar cancha..."
            // value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>FECHA RESERVA</th>
              <th>FECHA DE USO</th>
              <th>HORA</th>
              <th>NOMBRE DE LA CANCHA</th>
              <th>VALORAR</th>
            </tr>
          </thead>
          <tbody>
            {courts?.map((court) => (
              <tr key={court.id}>
                <td>{court.id}</td>
                <td>{court.name}</td>
                <td>
                  <button className="icon-btn" onClick={() => handleStarClick(court)}>
                    <FaStar />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
           {/* Modal para agregar reseña */}
           {isModalOpen && (
        <div className="modal-overlay">
          <div className="review-modal">
            <button 
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
            
            <h3>Deja tu reseña para {currentCourt?.name}</h3>
            
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
            
            <button 
              className="submit-review"
              onClick={handleSubmitReview}
            >
              Enviar Reseña
            </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingHistory;
