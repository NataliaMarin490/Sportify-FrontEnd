import "../Styles/header.css";
import { Link } from "react-router-dom";
import headerIcon from "../../public/logoHeader.svg";

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <Link to="/">
          <img alt="logo" src={headerIcon} className="logo-header" />
        </Link>
        <span>Donde empieza el partido</span>
      </div>
      <nav>
        <ul>
          <li className="link">Canchas</li>
          <Link className="link" to="/createAccount">
            Crear cuenta
          </Link>
          <Link className="link" to="/login">
            Iniciar sesión
          </Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
