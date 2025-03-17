import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from "../Context/global.context";
import "../Styles/bookingForm.css";

const BookingForm = ({ selectedDate, selectedTime }) => {
  const { user } = useContextGlobal();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [reserva, setReserva] = useState({
    name: "",
    phoneNumber: "",
    date: selectedDate ? selectedDate.toLocaleDateString() : "",
    time: selectedTime || "",
    number: "",
  });

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
    setShowModal(true);

    // Redirigir después de 9 segundos
    setTimeout(() => {
      setShowModal(false);
      navigate("/"); // Redirige a la página principal o donde desees
    }, 9000);
  };

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
        <label>Nombre Contacto: </label>
        <input
          placeholder="Nombre del representante"
          className="input"
          type="text"
          name="name"
          value={reserva.name}
          onChange={handleChange}
        />
        <label>Número Contacto: </label>
        <input
          placeholder="Número de teléfono"
          className="input"
          type="text"
          name="phoneNumber"
          value={reserva.phoneNumber}
          onChange={handleChange}
        />

        <div>
          <p>Fecha seleccionada: {selectedDate ? selectedDate.toLocaleDateString() : "No disponible"}</p>
          <p>Hora seleccionada: {selectedTime || "No disponible"}</p>
        </div>

        <button className="button-reserve" type="submit">Reservar</button>

        {error && <h4 className="error-message">{error}</h4>}
      </form>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>¡Reserva Exitosa!</h2>
            <p>Tu reserva ha sido confirmada.</p>
            <button className="button-modal" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
