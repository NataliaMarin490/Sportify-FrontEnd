import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from "../Context/global.context";
import axios from "axios";
import API_BASE_URL from "../config.js";
import "../Styles/bookingForm.css";

const BookingForm = ({
  selectedDate,
  selectedTime,
  pricePerHour,
  productInfo,
}) => {
  const { user } = useContextGlobal();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [reserva, setReserva] = useState({
    name: user?.fullName || localStorage.getItem("userName") || "",
    email: user?.email || localStorage.getItem("userEmail") || "",
    phoneNumber: user?.phoneNumber || localStorage.getItem("userPhone") || "",
    date: selectedDate ? selectedDate.toLocaleDateString() : "",
    time: selectedTime || "",
    number: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserDetailsExpanded, setIsUserDetailsExpanded] = useState(false);

  // Guarda el nombre y teléfono en localStorage cuando el usuario está disponible
  useEffect(() => {
    if (user) {
      localStorage.setItem("userName", user.fullName || "");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userPhone", user.phoneNumber || "");
      setReserva((prevReserva) => ({
        ...prevReserva,
        name: user.fullName,
        email: user.email,
      }));
    }
  }, [user]);

  // Se asegura de que los valores de reserva se actualicen si selectedDate o selectedTime cambian
  useEffect(() => {
    setReserva((prevReserva) => ({
      ...prevReserva,
      date: selectedDate ? selectedDate.toLocaleDateString() : prevReserva.date,
      time: selectedTime || prevReserva.time,
    }));
  }, [selectedDate, selectedTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva((prevReserva) => ({
      ...prevReserva,
      [name]: value,
    }));

    // Actualiza el localStorage cuando el usuario cambia el nombre o teléfono
    if (name === "name") {
      localStorage.setItem("userName", value);
    }
    if (name === "email") {
      localStorage.setItem("userEmail", value);
    }
    if (name === "phoneNumber") {
      localStorage.setItem("userPhone", value);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      setIsLoading(true);

      const startTime = Array.isArray(selectedTime)
        ? selectedTime[0]
        : selectedTime;
      const endTime = Array.isArray(selectedTime)
        ? selectedTime[selectedTime.length - 1]
        : selectedTime;

      const bookingData = {
        courtId: productInfo.id,
        bookingDate: selectedDate.toISOString().split("T")[0],
        startTime: startTime,
        endTime: endTime,
      };

      const url = `${API_BASE_URL}/api/bookings/create`;
      const response = await axios(url, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) throw new Error('Error al hacer la reserva');

      const data = await response.json();
      setShowConfirmModal(false);
      setShowModal(true);
    } catch (error) {
      setError("Error al crear la reserva. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const regexNum = /^[0-9]+$/;

    if (!user) {
      navigate("/login"); // Redirige a login si no está logueado
      return;
    }

    // Validaciones
    if (reserva.name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!regexNum.test(reserva.phoneNumber)) {
      setError("El número de contacto debe contener solo números.");
      return;
    }
    if (!regexNum.test(reserva.number) || reserva.number <= 0) {
      setError("Debe ingresar un número válido de participantes.");
      return;
    }

    setError(""); // Limpiar error en caso de que todo esté bien

    // Mostrar modal de éxito
    setShowConfirmModal(true);

    // Redirigir después de 9 segundos
    setTimeout(() => {
      setShowModal(false);
      navigate("/"); // Redirige a la página principal o donde desees
    }, 9000);
  };

  // Calcular la cantidad de horas seleccionadas
  const selectedHours = Array.isArray(selectedTime) ? selectedTime.length : 1;

  // Calcular el precio total
  const totalPrice = selectedHours * pricePerHour;

  return (
    <div className="booking-form-container">
      <h4 className="titleForm">Datos de Reserva</h4>

      <form className="formBooking" onSubmit={handleSubmit}>
        <label className="input-name">Número Participantes: </label>
        <input
          placeholder="Cantidad de personas"
          className="input"
          type="number"
          name="number"
          value={reserva.number}
          onChange={handleChange}
        />
        <label>Nombre: </label>
        <input
          placeholder="Nombre del representante"
          className="input"
          type="text"
          name="name"
          value={reserva.name}
          onChange={handleChange}
        />
        <label>Email: </label>
        <input
          placeholder="Correo electrónico"
          className="input"
          type="email"
          name="email"
          value={reserva.email || ""}
          onChange={handleChange}
        />
        <label>Número (Opcional): </label>
        <input
          placeholder="Número de teléfono"
          className="input"
          type="text"
          name="phoneNumber"
          value={reserva.phoneNumber || ""}
          onChange={handleChange}
        />
        {selectedTime && selectedTime.length > 0 && (
          <div>
            <p>
              Fecha seleccionada:{" "}
              <strong>
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : "No disponible"}
              </strong>
            </p>
            <p>
              Cantidad de horas:{" "}
              <strong>
                {Array.isArray(selectedTime) ? selectedTime.length : 1}
              </strong>
            </p>
            <p>
              Precio total: <strong>${totalPrice}</strong>
            </p>
          </div>
        )}

        <button className="button-reserve" type="submit">
          Realizar reserva
        </button>

        {error && <h4 className="error-message">{error}</h4>}
      </form>

      {showConfirmModal && (
        <div className="modal confirmation-modal">
          <div className="modal-content">
            <h2>Confirmar Reserva</h2>

            <div className="confirmation-details">
              <div className="court-details">
                <h3>Detalles de la Cancha</h3>
                <div className="court-images">
                  <img
                    src={productInfo.imageUrl[0]}
                    alt={productInfo.name}
                    className="featured-image"
                  />
                  <div className="image-grid">
                    {productInfo.imageUrl.slice(1, 4).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${productInfo.name} ${index + 1}`}
                        className="thumbnail-image"
                      />
                    ))}
                  </div>
                </div>
                <p>
                  <strong>Nombre:</strong> {productInfo.name}
                </p>
                <p>
                  <strong>Ubicación:</strong> {productInfo.city}
                </p>
                <p>
                  <strong>Deporte:</strong> {productInfo.sport}
                </p>
              </div>

              <div className="booking-details">
                <h3>Detalles de la Reserva</h3>
                <p>
                  <strong>Fecha:</strong> {selectedDate.toLocaleDateString()}
                </p>
                <p>
                  <strong>Hora:</strong>{" "}
                  {Array.isArray(selectedTime)
                    ? `${selectedTime[0]} - ${
                        selectedTime[selectedTime.length - 1]
                      }`
                    : selectedTime}
                </p>
                <p>
                  <strong>Precio Total:</strong> ${totalPrice}
                </p>
              </div>

              <div className="user-details">
                <div className="section-header">
                  <h3>Datos del Usuario</h3>
                  <button
                    className="expand-button"
                    onClick={() =>
                      setIsUserDetailsExpanded(!isUserDetailsExpanded)
                    }
                  >
                    {isUserDetailsExpanded ? "−" : "+"}
                  </button>
                </div>
                <div
                  className={`details-content ${
                    isUserDetailsExpanded ? "expanded" : ""
                  }`}
                >
                  <p>
                    <strong>Nombre:</strong> {reserva.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {reserva.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {reserva.phoneNumber || "No especificado"}
                  </p>
                  <p>
                    <strong>Participantes:</strong> {reserva.number}
                  </p>
                  {isUserDetailsExpanded && (
                    <>
                      <p>
                        <strong>Tipo de Documento:</strong> DNI
                      </p>
                      <p>
                        <strong>Número de Documento:</strong>{" "}
                        {user?.documentNumber || "No especificado"}
                      </p>
                      <p>
                        <strong>Dirección:</strong>{" "}
                        {user?.address || "No especificada"}
                      </p>
                      <p>
                        <strong>Ciudad:</strong>{" "}
                        {user?.city || "No especificada"}
                      </p>
                      <p>
                        <strong>País:</strong>{" "}
                        {user?.country || "No especificado"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="button-confirm"
                onClick={handleConfirmBooking}
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Confirmar Reserva"}
              </button>
              <button
                className="button-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>¡Reserva Exitosa!</h2>
            <p>Tu reserva ha sido confirmada.</p>
            <button
              className="button-modal"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
