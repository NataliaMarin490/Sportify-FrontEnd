import { Link } from "react-router-dom";
import "../Styles/header.css";

const Header = () => {
  return (
    <header>
      <Link to="/">
        <h1 className="logo">Logo</h1>
      </Link>
      <nav>
        <ul>
          <li>Crear cuenta</li>
          <li>Iniciar sesión</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
