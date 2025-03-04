import "../Styles/header.css";
import { Link } from "react-router-dom";
import headerIcon from "../../public/logoHeader.svg";
import UserAvatar from "./UserAvatar";

const Header = ({ user, onLogout }) => {
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
          {/* Si el usuario está autenticado, mostramos el avatar */}
          {user ? (
            <UserAvatar userName={user.fullName} onLogout={onLogout} />
          ) : (
            <>
              <Link className="link-header" to="/createAccount">
                Crear cuenta
              </Link>
              <Link className="link-header" to="/login">
                Iniciar sesión
              </Link>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
