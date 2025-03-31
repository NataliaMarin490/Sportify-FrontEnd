import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import "../Styles/userBookingHistory.css";
import BackButton from "../components/BackButton";
import API_BASE_URL from "../config";
import { useContextGlobal } from "../Context/global.context";

const UserBookingHistory = () => {
  const [courts, setCourts] = useState([]); // Lista de canchas
  const [filteredCourts, setFilteredCourts] = useState([]); // Lista de canchas filtradas
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourt, setCurrentCourt] = useState(null);
  const [rating, setRating] = useState(0); // Calificación seleccionada
  const [comment, setComment] = useState(""); // Comentario de la reseña
  const [search, setSearch] = useState(""); // Estado del término de búsqueda
  const [ratings, setRatings] = useState({}); // Estado para simular las calificaciones de las canchas
  const [comments, setComments] = useState({}); // Estado para almacenar los comentarios
  const [users, setNameUsers] = useState({}); // Estado para almacenar los nombres de los usuarios
  const { user } = useContextGlobal(); // Accedemos al nombre del usuario del contexto global
  const [dates, setDates] = useState({}); // Estado para almacenar las fechas de las reseñas

  const url = `${API_BASE_URL}/public/courts/search?page=1&size=10`;

  useEffect(() => {
    axios(url)
      .then((res) => {
        const courtsData = res.data.data;

        // Recuperamos las calificaciones, comentarios y nombre del usuario de localStorage
        const savedRatings = JSON.parse(localStorage.getItem("ratings")) || {};
        const savedComments =
          JSON.parse(localStorage.getItem("comments")) || {};
        const savedUsers = JSON.parse(localStorage.getItem("users")) || {}; // Recuperamos usuarios

        // Actualizamos los estados con la información almacenada en localStorage
        setCourts(courtsData);
        setFilteredCourts(courtsData); // Inicialmente, mostramos todas las canchas
        setRatings(savedRatings);
        setComments(savedComments);
        setNameUsers(savedUsers); // Establecemos los usuarios guardados
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, []); // Este hook se ejecuta solo una vez al montar el componente

  // Función para filtrar las canchas por nombre
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    if (query) {
      // Filtramos las canchas cuyo nombre contiene el texto de búsqueda
      setFilteredCourts(
        courts.filter((court) =>
          court.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      // Si el campo de búsqueda está vacío, mostramos todas las canchas
      setFilteredCourts(courts);
    }
  };

  // Función para manejar el clic en una estrella (abrir el modal de reseña)
  const handleStarClick = (court) => {
    setCurrentCourt(court);
    setRating(ratings[court.id] || 0); // Establecer la calificación simulada de la cancha
    setComment(comments[court.id] || ""); // Establecer el comentario previamente guardado para esta cancha
    setIsModalOpen(true);
  };

  // Función para manejar el envío de la reseña
  const handleSubmitReview = () => {
    const userName = user.fullName || "Anónimo"; // Obtenemos el nombre del usuario
    const reviewDate = new Date().toISOString(); // Fecha actual de la reseña

    // Guardamos la nueva calificación, comentario, nombre del usuario y fecha en los estados
    const updatedRatings = { ...ratings, [currentCourt.id]: rating };
    const updatedComments = { ...comments, [currentCourt.id]: comment };
    const updatedUsers = { ...users, [currentCourt.id]: userName }; // Guardamos el nombre del usuario
    const updatedDates = { ...dates, [currentCourt.id]: reviewDate }; // Guardamos la fecha

    // Actualizamos los estados con la nueva calificación, comentario, nombre del usuario y fecha
    setRatings(updatedRatings);
    setComments(updatedComments);
    setNameUsers(updatedUsers);
    setDates(updatedDates); // Estado para almacenar las fechas

    // Guardamos la nueva información en localStorage
    localStorage.setItem("ratings", JSON.stringify(updatedRatings));
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    localStorage.setItem("users", JSON.stringify(updatedUsers)); // Guardamos el nombre del usuario
    localStorage.setItem("dates", JSON.stringify(updatedDates)); // Guardamos la fecha

    // Cerrar el modal y resetear los valores
    setIsModalOpen(false);
    setRating(0);
    setComment("");
  };

  const handleCancelReview = () => {
    // Resetear los valores y cerrar el modal
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
            value={search}
            onChange={handleSearchChange} // Se maneja el cambio de texto
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>FECHA</th>
              <th>HORA</th>
              <th>CANCHA</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredCourts?.map((court) => (
              <tr key={court.id}>
                <td>{court.id}</td>
                <td>{court.name}</td>
                <td>{court.name}</td>
                <td>
                  <button
                    className="icon-btn"
                    onClick={() => handleStarClick(court)}
                  >
                    {/* Mostrar estrella rellena si la cancha tiene una calificación simulada */}
                    {ratings[court.id] > 0 ? (
                      <FaStar color="gold" />
                    ) : (
                      <FaRegStar />
                    )}
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

            <h3>
              Deja aquí tu experiencia para la reserva: {currentCourt?.name}
            </h3>

            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)} // Cuando se haga clic en una estrella, actualizará la calificación.
                  style={{ cursor: "pointer" }}
                >
                  {star <= rating ? <FaStar color="gold" /> : <FaRegStar />}{" "}
                </span>
              ))}
            </div>

            <textarea
              placeholder="Escribe tu comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)} // Aquí actualizamos el comentario
              rows={4}
            />

            <div className="review-modal-actions">
              <button className="submit-review" onClick={handleSubmitReview}>
                Publicar
              </button>
              <button className="cancel-review" onClick={handleCancelReview}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingHistory;
