import "../Styles/header.css";
import { Link } from "react-router-dom";
import Logo from "../../public/icons/Logo";

const Header = () => {
  return (
    <header>
      <Link to="/">
        <Logo height="100px" width="100px" />
      </Link>
      <nav>
        <ul>
          <li className="home-link">Inicio</li>
          <Link to="/crearCuenta">Crear cuenta</Link>
          <li>Canchas</li>
          <Link to="/IniciarSesion">Iniciar sesión</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
