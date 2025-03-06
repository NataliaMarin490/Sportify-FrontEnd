import "../Styles/footer.css"
import footerIcon from "../../public/logoFooter.svg";

const Footer = () => {
  return (
    <footer>
      <div className="footerContainer">
        <div className="footerLogo">
          <img alt="logo" src={footerIcon} className="logo-footer"/>
          <p>ALLRIGHTS RESERVED - 2025 ©</p>
        </div>
        <div className="footerSocial">
          <img className="contact" src="\icons\message.png" alt="Mensaje"></img>
          <p>hello@sportify.com</p>
          <img className="Social-face" src="\icons\facebook-icon-2.svg" alt="Facebook"></img>
          <img className="Social" src="\icons\twitter-2.svg" alt="Twitter"></img>
          <img className="Social-insta" src="\icons\instagram-2.svg" alt="Instagram"></img>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
