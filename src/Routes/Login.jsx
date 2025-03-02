import "../Styles/login.css";
import { Link } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
import PropTypes from 'prop-types';
import useLogin from "../Hooks/useLogin";


// version anterior para login
/* const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
  };

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/login", formData);

      localStorage.setItem("user", JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError(`Credenciales incorrectas. ${err.response?.data?.message || "Inténtalo de nuevo."}`);
    }
  }; */

  // login utilizando HOOK

  const Login = ({ onLogin }) => {
    const { formData, error, handleChange, handleSubmit } = useLogin(onLogin);
  
    Login.propTypes = {
      onLogin: PropTypes.func.isRequired,
    };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1>Hola!</h1>
          <h3>Bienvenido de nuevo.</h3>
          <img className="logo-sportify-bienvenida" src="\logoWhite.svg" alt=""></img>
        </div>

        <div className="login-right">
        <div className="icons-container">
          <img className="icons1" src="\icons\deportes\futbol-icono-version-2.svg" alt="ok"></img>
          <img className="icons2" src="\icons\deportes\voley-icono-version-2.svg" alt=""></img>
          <img className="icons3" src="\icons\deportes\tenis-icono-version-2.svg" alt=""></img>
          <img className="icons4" src="\icons\deportes\basketball-icono-version-2.svg" alt=""></img>
        </div>

        {/* <h2>Iniciar Sesión</h2> */}

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-container">
          <label>Email</label>
          <input
            className="input-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-container">
          <label>Contraseña</label>
          <input
            className="input-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="remember-option">
          <div>
            <input type="checkbox" name="remember" />
            <label>Recuérdame</label>
          </div>

          <Link className="password-forget" to="/Recovery">¿Olvidaste la contraseña?</Link>
        </div>

        <button type="submit" className="login-button">Iniciar Sesión</button>

        <p className="create-account">
              No tienes una cuenta? <Link to="/CreateAccount">Crea una gratis</Link>
        </p>
      </form>
      <div className="icons-container">
        <img className="icons1" src="\icons\deportes\futbol-icono-version-2.svg" alt="ok"></img>
        <img className="icons2" src="\icons\deportes\voley-icono-version-2.svg" alt=""></img>
        <img className="icons3" src="\icons\deportes\tenis-icono-version-2.svg" alt=""></img>
        <img className="icons4" src="\icons\deportes\basketball-icono-version-2.svg" alt=""></img>
      </div>
    </div>
  </div>
  </div>
  );
};

export default Login;
