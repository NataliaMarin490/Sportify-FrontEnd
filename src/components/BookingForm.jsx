import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from "../Context/global.context";
import "../Styles/bookingForm.css";

const BookingForm = ({ selectedDate, selectedTime }) => {
  const { user } = useContextGlobal();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [reserva, setReserva] = useState({
    name: user.name || "",
    phoneNumber: user.phoneNumber || "",
    date: selectedDate.toLocaleDateString() || "",
    time: selectedTime || "",
    number: user.number || "",
  });

  const handleChange = (e) => {
    setReserva({ ...reserva, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías realizar la lógica de envío (por ejemplo, llamar a una API)

    const formData = {
      name: reserva.name,
      phoneNumber: reserva.phoneNumber,
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      number: reserva.number,
    };

    const regexNum = /[0-9]+$/;

    if (!user) {
      navigate("/login"); // Redirige a login si no está loguedo
      return;
    }

    let newError = {};
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

    // Si hay errores, no enviamos el formulario
    if (Object.keys(newError).length > 0) {
      setSuccessMessage("Revisa los datos ingresados");
      console.log(newError);
      setError(newError);
      return;
    }

    setError("");
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/");
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
          value={reserva.number}
          onChange={(event) =>
            setReserva({ ...reserva, number: event.target.value })
          }
        />
        <label>Nombre Contacto: </label>
        <input
          placeholder="Nombre del representante"
          className="input"
          type="name"
          value={reserva.name}
          onChange={(event) =>
            setReserva({ ...reserva, name: event.target.value })
          }
        />
        <label>Número Contacto: </label>
        <input
          placeholder="Número de telefono"
          className="input"
          type="phoneNumber"
          value={reserva.phoneNumber}
          onChange={(event) =>
            setReserva({ ...reserva, phoneNumber: event.target.value })
          }
        />

        <div>
          <p>Fecha seleccionada: {selectedDate.toLocaleDateString()}</p>
          <p>Hora seleccionada: {selectedTime}</p>
        </div>

        <button className="button-reserve">Reservar</button>
        {error && <h4 className="error-message">{error}</h4>}

        {console.log(
          reserva.name,
          reserva.phoneNumber,
          reserva.number,
          selectedDate.toLocaleDateString(),
          selectedTime
        )}
      </form>
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
