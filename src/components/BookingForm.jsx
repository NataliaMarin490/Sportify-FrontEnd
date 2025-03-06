import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContextGlobal } from "../Context/global.context";
import "../Styles/bookingForm.css";

const BookingForm = () => {
  const { user } = useContextGlobal();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [reserva, setReserva] = useState({
    name: "",
    phone: "",
    participants: "",
    address: "",
  });
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const regexNum = /[0-9]+$/;

    if (!user) {
      navigate("/login"); // Redirige a login si no está loguedo
      return;
    }

    // Validaciones
    if (reserva.name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!regexNum.test(reserva.phone)) {
      setError("El número de contacto debe contener solo números.");
      return;
    }
    if (!regexNum.test(reserva.participants) || reserva.participants <= 0) {
      setError("Debe ingresar un número válido de participantes.");
      return;
    }

    setError("");
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
      navigate("/");
    }, 3000);
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
            value={reserva.participants}
            onChange={(event) =>
              setReserva({ ...reserva, participants: event.target.value })
            }
          />
          <label>Nombre Contacto: </label>
          <input
            placeholder="Nombre del representante"
            className="input"
            type="text"
            value={reserva.name}
            onChange={(event) =>
              setReserva({ ...reserva, name: event.target.value })
            }
          />
          <label>Número Contacto: </label>
          <input
            placeholder="Número de telefono"
            className="input"
            type="text"
            value={reserva.phone}
            onChange={(event) =>
              setReserva({ ...reserva, phone: event.target.value })
            }
          />

          <button className="button-reserve">Reservar</button>
          {error && <h4 className="error-message">{error}</h4>}

          {/* {error ? (<h4 className="title" style={{ color: "red" }}>
              Por favor coloque la información correctamente
            </h4>) : null} */}
        </form>
        {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>¡Reserva Exitosa!</h2>
            <p>Tu reserva ha sido confirmada.</p>
            <button className="button-modal" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
