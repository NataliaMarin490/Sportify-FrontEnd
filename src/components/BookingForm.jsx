import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/bookingForm.css";

const BookingForm = () => {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    participants: "",
    address: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const regexNum = /[0-9]/;

    if (
      user.name.trim().length >= 3 &&
      user.phone.includes(" ") &&
      user.participants.includes(" ") &&
      regexNum.test(user.phone)
    ) {
      setShow(true);
      setError(false);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } else {
      setError(true);
    }
  };

  return (
    <div className="booking-form-container">
      <h4 className="tituloForm">Datos de Reserva</h4>
      {show ? (
        <>
          <div>{user.name}</div>
          <div>{user.address} </div>
        </>
      ) : (
        <form className="formReserva" onSubmit={handleSubmit}>
          <label>Número Participantes: </label>
          <input
            placeholder="Cantidad de personas"
            type="number"
            onChange={(event) =>
              setUser({ ...user, address: event.target.value })
            }
          />
          <label>Nombre Contacto: </label>
          <input
            placeholder="Nombre del representante"
            type="text"
            onChange={(event) =>
              setUser({ ...user, nombre: event.target.value })
            }
          />
          <label>Número Contacto: </label>
          <input
            placeholder="Número de telefono"
            type="number"
            onChange={(event) =>
              setUser({ ...user, direccion: event.target.value })
            }
          />

          <button>Reservar</button>
          {error ? (
            <h4 className="title" style={{ color: "red" }}>
              Por favor coloque la información correctamente
            </h4>
          ) : null}
        </form>
      )}
    </div>
  );
};

export default BookingForm;
