import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar, FaRegStar } from "react-icons/fa";
import "../Styles/userBookingHistory.css";
import BackButton from "../components/BackButton";
import ReviewModal from "../components/ReviewModal";
import API_BASE_URL from "../config";
import { useContextGlobal } from "../Context/global.context";
import { Link } from "react-router-dom";

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState([]); // Lista de reservas
  const [filteredBookings, setFilteredBookings] = useState([]); // Reservas filtradas
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de reseña
  const [currentBooking, setCurrentBooking] = useState(null); // Reserva actual
  const [search, setSearch] = useState(""); // Término de búsqueda
  const [reviews, setReviews] = useState({}); // Reseñas y puntuaciones
  const { user } = useContextGlobal(); // Obtener usuario desde contexto global

  // Cargar reseñas desde localStorage al iniciar
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem("reviews")) || {};
    setReviews(savedReviews);

    const fetchBookingHistory = async () => {
      if (!user?.token) {
        setError("Usuario no autenticado");
        return;
      }

      const tokenExp = user.token.split(".")[3];
      if (Date.now() >= tokenExp * 1000) {
        setError("Sesión expirada, por favor vuelve a iniciar sesión");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/history`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        const bookingsData = response.data;
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
      } catch (err) {
        console.error("Error detallado:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Error al cargar historial.");
        if (err.response?.status === 401) {
          setError("Sesión expirada o no autorizada.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingHistory();
  }, [user?.token]);

  // Función para filtrar reservas por nombre de cancha
  useEffect(() => {
    if (!search) {
      setFilteredBookings(bookings);
      return;
    }

    setFilteredBookings(
      bookings.filter(
        (booking) =>
          booking.courtName.toLowerCase().includes(search.toLowerCase()) ||
          booking.bookingDate.toLowerCase().includes(search.toLowerCase()) ||
          booking.bookingTimeRange.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, bookings]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStarClick = (booking) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
    console.log(booking);
  };

  const handleSubmitReview = (courtId, idBooking, rating, comment) => {
    const newReview = {
      courtId,
      idBooking,
      rating,
      comment,
      userName: user.fullName || "Anónimo",
      date: new Date().toISOString(),
    };

    // Crear una copia del objeto de reseñas, asegurando que la estructura esté bien
    const updatedReviews = { ...reviews };
    console.log(updatedReviews);

    if (!updatedReviews[courtId]) {
      updatedReviews[courtId] = {}; // Si no existe, crear el objeto para courtId
    }

    updatedReviews[courtId][idBooking] = newReview; // Guardar la reseña bajo courtId y bookingId

    // Actualizar el estado local con las reseñas
    setReviews(updatedReviews);

    // Guardar las reseñas en localStorage usando la misma estructura
    try {
      localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    } catch (err) {
      console.error("Error saving reviews to localStorage:", err);
    }

    setIsModalOpen(false);
  };

  const handleCancelReview = () => {
    setIsModalOpen(false);
  };

  const formatRegistrationDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const formatTimeRange = (timeRange) => {
    return timeRange.replace(/:\d{2}(?= - |$)/g, "");
  };

  return (
    <div className="background-container">
      <BackButton />
      <div className="booking-history-container">
        <div className="div-tittle">
          <h3>HISTORIAL DE RESERVAS</h3>
          <span>Accede aquí al historial de tus reservas</span>
        </div>

        <div className="search-div">
          <div className="search-container-booking">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar cancha..."
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>FECHA REGISTRO</th>
              <th>FECHA RESERVA</th>
              <th>HORA</th>
              <th>CANCHA</th>
              <th>VALORAR</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="loading">
                  Cargando historial...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="error">
                  {error}
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-bookings">
                  {search
                    ? "No se encontraron reservas con ese criterio de búsqueda"
                    : "No tienes reservas en tu historial"}
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.idBooking}>
                  <td>{formatRegistrationDate(booking.registrationDate)}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>{formatTimeRange(booking.bookingTimeRange)}</td>
                  <td>
                    <Link
                      to={`/detail/${booking.courtId}`}
                      className="court-name-link"
                    >
                      {booking.courtName}
                    </Link>
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleStarClick(booking)}
                    >
                      {/* Aquí se corrige la lógica para la estrella */}
                      {reviews[booking.courtId]?.[booking.idBooking]?.rating >
                      0 ? (
                        <FaStar color="white" />
                      ) : (
                        <FaRegStar />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && currentBooking && (
        <ReviewModal
          booking={currentBooking}
          initialRating={
            reviews[currentBooking.courtId]?.[currentBooking.idBooking]
              ?.rating || 0
          }
          initialComment={
            reviews[currentBooking.courtId]?.[currentBooking.idBooking]
              ?.comment || ""
          }
          onSubmit={handleSubmitReview}
          onCancel={handleCancelReview}
        />
      )}
    </div>
  );
};

export default UserBookingHistory;
