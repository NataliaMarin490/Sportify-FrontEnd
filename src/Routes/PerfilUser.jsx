import BackButton from "../components/BackButton";
import "../Styles/perfilUser.css";
import FormsUser from "../components/FormsUser.jsx";
import UserAvatar from "../components/UserAvatar.jsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const user = {
  name: "Juan",
  lastName: "Pérez",
  email: "juan@example.com",
  phoneNumber: "123456789",
  cityId: 1,
  birthdate: "2000-12-01",
  password: "********",
  confirmpassword: "*******",
  country: 1,
  region: 1,
};

const PerfilUser = () => {
  const location = useLocation(); // Obtener la ruta actual

  useEffect(() => {
    document.body.classList.add("hide-nav"); // Agrega la clase para ocultar el nav
    return () => {
      document.body.classList.remove("hide-nav"); // La remueve al salir de la página
    };
  }, []);

  const handleUpdate = (updatedUser) => {
    console.log("Actualizando usuario:", updatedUser);

    fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userToSend),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en el registro");
        return response.text();
      })
      .then((data) => {
        console.log("Registro exitoso:", data);
        setSuccessMessage("Usuario registrado correctamente!");
        setUserData({
          name: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          //cityId: "",
          birthdate: "",
          password: "",
          confirmpassword: "",
          country: "",
          //region: "",
          //idDocumentType: "",
          //document: "",
        });
        setErrors({});
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
      });
  };

  // Lógica para esconder los enlaces
  const hideLinks = location.pathname === "/profile"; // Si estamos en la página de crear cuenta, ocultamos los enlaces

  return (
    <>
      <div className="container-profile-ppal">
        {/* Avatar de usuario */}
        <div className="user-avatar-container">
          <UserAvatar userName={user.name} />
        </div>
        <div className="back-button-perfil">
          <BackButton />
        </div>
        <div className="container-profile">
          <img
            className="imagen-account"
            src="public/images/perfil/perfil.jpg"
            alt="Imagen de perfil"
          ></img>
          <div className="subcontainer-pofile">
            <span className="titulo-account">
              {user.name} {user.lastName}
            </span>
            <FormsUser user={user} onSubmit={handleUpdate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilUser;
