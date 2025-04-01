import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaStar, FaRegStar} from "react-icons/fa";
import "../Styles/userBookingHistory.css";
import BackButton from "../components/BackButton";
import ReviewModal from "../components/ReviewModal";
import API_BASE_URL from "../config";
import { useContextGlobal } from "../Context/global.context";

const UserBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState({});
  const { user } = useContextGlobal();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      // Verificar token existe y no está expirado
      if (!user?.token) {
        setError("Usuario no autenticado");
        return;
      }
  
      // Verificar expiración del token (ejemplo básico)
      const tokenExp = user.token.split('.')[3]; // Asumiendo formato JWT estándar
      if (Date.now() >= tokenExp * 1000) {
        setError("Sesión expirada, por favor vuelve a iniciar sesión");
        return;
      }
  
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/history`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
  
        const bookingsData = response.data;
        console.log(bookingsData);
        
        
        // Resto de tu lógica...
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
  
      } catch (err) {
        console.error("Error detallado:", err.response?.data || err.message);
        setError(err.response?.data?.message || 
          "Error al cargar historial. Verifica tu conexión o intenta recargar.");
        
        if (err.response?.status === 401) {
          // Manejar específicamente error de autenticación
          setError("Sesión expirada o no autorizada. Por favor inicia sesión nuevamente.");
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBookingHistory();
  }, [user?.token]);

  useEffect(() => {
    // Actualizar filteredBookings cuando cambia search o bookings
    if (!search) {
      setFilteredBookings(bookings);
      return;
    }
    
    setFilteredBookings(
      bookings.filter(booking =>
        booking.countName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, bookings]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleStarClick = (booking) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  };

  const handleSubmitReview = (bookingId, rating, comment) => {
    const newReview = {
      rating,
      comment,
      userName: user.fullName || "Anónimo",
      date: new Date().toISOString()
    };

    const updatedReviews = { ...reviews, [bookingId]: newReview };
    setReviews(updatedReviews);
    
    // Guardar en localStorage
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

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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
                <td colSpan="6" className="loading">Cargando historial...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="error">{error}</td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-bookings">
                  {search ? "No se encontraron reservas con ese criterio de búsqueda" : "No tienes reservas en tu historial"}
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.idBooking}>
                  <td>{formatDate(booking.registrationDate)}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>{booking.bookingTimeRange}</td>
                  <td>{booking.courtName}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleStarClick(booking)}
                    >
                      {reviews[booking.idBooking]?.rating > 0 ? (
                        <FaStar color="gold" />
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
          initialRating={reviews[currentBooking.idBooking]?.rating || 0}
          initialComment={reviews[currentBooking.idBooking]?.comment || ""}
          onSubmit={handleSubmitReview}
          onCancel={handleCancelReview}
        />
      )}
    </div>
  );
};

export default UserBookingHistory;
