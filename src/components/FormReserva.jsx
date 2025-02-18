import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/formulario.css";

const Form = () => {
  const [user, setUser] = useState({
    nombre: "",
    telefono: "",
    participantes: "",
  });
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const regexNum = /[0-9]/;

    if (
      user.nombre.trim().length >= 3 &&
      user.telefono.includes(" ") &&
      user.participantes.includes(" ") &&
      regexNum.test(user.telefono)
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
    <div className="formulario">
      <h4>Datos de Reserva</h4>
      {/* {condicion ? true : false } */}
      {show ? (
        <>
          <div>{user.nombre}</div>
          <div>{user.direccion} </div>
        </>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <label>Número Participantes: </label>
          <input
            placeholder="Cantidad de personas"
            type="number"
            onChange={(event) =>
              setUser({ ...user, direccion: event.target.value })
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

export default Form;
