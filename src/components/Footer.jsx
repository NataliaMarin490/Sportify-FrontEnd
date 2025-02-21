import "../Styles/footer.css";
import LogoFooter from "../../public/icons/LogoFooter";

const Footer = () => {
  return (
    <footer>
      <div className="footerContainer">
        <div className="footerLogo">
          <LogoFooter className="Logo" height="100px" width="100px" />
          <p>ALLRIGHTS RESERVED - 2025 ©</p>
        </div>
        <div className="footerSocial">
          <img className="Mensaje" src="\icons\message.png" alt="Mensaje"></img>
          <p>hello@sportify.com</p>
          <img className="Social" src="\icons\social3.png" alt="Facebook"></img>
          <img className="Social" src="\icons\social2.png" alt="Twitter"></img>
          <img
            className="Social"
            src="\icons\social1.png"
            alt="Instagram"
          ></img>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
