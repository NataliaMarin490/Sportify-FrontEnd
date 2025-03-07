import "../Styles/login.css";
import { useState } from "react";
// import axios from "axios";
import PropTypes from 'prop-types';
import useLogin from "../Hooks/useLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";

  // login utilizando HOOK

  const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const location = useLocation(); // para ir a la anterior pagina
    const from = location.state?.from || "/";

    const { formData, error, handleChange, handleSubmit } =     useLogin((userData) => {
    onLogin(userData);
    navigate(from, { replace: true }); 
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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

        <form className="form-login" onSubmit={handleSubmit}>
          <div className="input-container">
          <label className="input-container-label">Email</label>
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
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <img src="\icons\eye-open.svg" alt="Ver contraseña" />
              ) : (
                <img src="\icons\eye-closed.svg" alt="Ocultar contraseña" />
              )}
            </button>
                        
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

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;