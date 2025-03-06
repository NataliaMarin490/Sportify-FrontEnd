import BackButton from "../components/BackButton.jsx";
import "../Styles/userProfile.css";
import FormsUser from "../components/FormsUser.jsx";
import UserAvatar from "../components/UserAvatar.jsx";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const user = {
  name: "Juan",
  lastName: "Pérez",
  email: "juan@example.com",
  phoneNumber: "123456789",
  birthdate: "2000-12-01",
  password: "********",
  confirmpassword: "*******",
  country: 1,
};

const UserProfile = () => {
  const location = useLocation(); // Obtener la ruta actual

  const [userData, setUserData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    birthdate: user.birthdate || "",
    password: user.password || "",
    confirmpassword: user.confirmpassword || "",
    country: user.country || "",
  });

  useEffect(() => {
    document.body.classList.add("hide-nav"); // Agrega la clase para ocultar el nav
    return () => {
      document.body.classList.remove("hide-nav"); // La remueve al salir de la página
    };
  }, []);

  const handleUpdate = (updatedUser) => {
    console.log("Actualizando usuario:", updatedUser);

    const userToSend = {
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      birthdate: userData.birthdate,
      countryId: parseInt(userData.country, 10),
    };

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
          birthdate: "",
          password: "",
          confirmpassword: "",
          country: "",
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
        <div className="back-button-profile">
          <BackButton />
        </div>
        <div className="container-profile">
          <img
            className="image-account"
            src="public/images/perfil/perfil.jpg"
            alt="Imagen de perfil"
          ></img>
          <div className="subContainer-profile">
            <span className="title-account">
              {user.name} {user.lastName}
            </span>
            <FormsUser user={user} onSubmit={handleUpdate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
