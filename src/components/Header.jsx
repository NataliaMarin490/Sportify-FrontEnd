import "../Styles/header.css";
import { Link } from "react-router-dom";
import LogoHeader from "../../public/icons/LogoHeader";

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <Link to="/">
          <LogoHeader height="100px" width="100px" />
        </Link>
        <span>Donde empieza el partido</span>
      </div>
      <nav>
        <ul>
          <li>Canchas</li>
          <Link to="/createAccount">Crear cuenta</Link>
          <Link to="/login">Iniciar sesión</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
