import "../Styles/createAccount.css";
import FormsUser from "../components/FormsUser.jsx";

const CreateAccount = () => {
  const handleRegister = (newUser) => {
    console.log("Registrando usuario:", newUser);

    // Enviar datos al backend
    fetch("http://localhost:8080/api/auth/register", {
      method: "POST", // Método POST para enviar datos
      headers: {
        "Content-Type": "application/json", // Asegurarse de que los datos sean enviados en formato JSON
      },
      body: JSON.stringify(newUser), // Convertir el objeto a JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Usuario registrado:", data);
        // Aquí puedes manejar la respuesta del servidor, por ejemplo, mostrar un mensaje o redirigir
      })
      .catch((error) => {
        console.error("Error al registrar usuario:", error);
      });
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
