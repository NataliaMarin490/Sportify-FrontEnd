import "../Styles/createAccount.css";
import FormsUser from "../components/FormsUser.jsx";

const CreateAccount = () => {
  const handleRegister = (newUser) => {
    console.log("Registrando usuario:", newUser);
  };

  return (
    <div className="account-container">
      <div className="details-register-container">
        <div className="details-register-subcontainer">
          <img
            className="imagen-account"
            src="public\images\crearCuenta\side-view-female-friends-playing-basketball.png"
            alt="friends-Female"
          ></img>
          <div className="forms-title">
            <span className="titulo-account">Crea tu cuenta</span>
            <FormsUser user={{}} onSubmit={handleRegister} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
