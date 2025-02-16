import "../Styles/footer.css";
import Logo from "../../public/icons/Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footerContainer">
        <div className="footerLogo">
          <Link to="/">
            <Logo className="Logo" height="100px" width="100px" />
          </Link>
          <p>ALLRIGHTS RESERVED - ©</p>
        </div>
        <div className="footerContacto">
          <img
            className="Mensaje"
            src="public\icons\message.png"
            alt="Mensaje"
          ></img>
          <p>hello@sportify.com</p>
        </div>
        <div className="footerSocial">
          <img
            className="Social"
            src="public\icons\social3.png"
            alt="Facebook"
          ></img>
          <img
            className="Social"
            src="public\icons\social2.png"
            alt="Twitter"
          ></img>
          <img
            className="Social"
            src="public\icons\social1.png"
            alt="Instagram"
          ></img>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
