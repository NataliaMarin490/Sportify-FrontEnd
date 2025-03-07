/* import { useContext } from "react"; */
import "../Styles/header.css";
import { Link } from "react-router-dom";
import headerIcon from "../../public/logoHeader.svg";
import UserAvatar from "./UserAvatar";
import PropTypes from "prop-types";
import { useContextGlobal } from "../Context/global.context";

const Header = () => {
  const { user, logout } = useContextGlobal();

/* const Header = ({ user, onLogout }) => {
  console.log("User en Header:", user); */

  return (
    <header className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img alt="Sportify Logo" src={headerIcon} className="logo-header" />
        </Link>
        <span className="slogan">Donde empieza el partido</span>
      </div>

      <nav className="nav-container">
        {user ? (
          <UserAvatar userName={user.fullName} onLogout={logout} />
        ) : (
          <div className="auth-links">
            <Link to="/login" className="link-header">
              Iniciar sesión
            </Link>
            <Link to="/createAccount" className="link-header">
              Crear cuenta
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object, // Puede ser null o un objeto con la información del usuario
  onLogout: PropTypes.func.isRequired, // La función de logout es obligatoria
};

export default Header;
