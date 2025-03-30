import { useContextGlobal } from "../Context/global.context";
import { useEffect } from "react";
/* import { useContext } from "react"; */
import BackButton from "../components/BackButton";
import "../Styles/userProfile.css";
import FormsUser from "../components/FormsUser";
import UserAvatar from "../components/UserAvatar";
import API_BASE_URL from "../config";

const UserProfile = () => {
  const { user, setUser } = useContextGlobal();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  if (!user) return <p>Cargando perfil...</p>;

  const handleUpdateUser = (updatedData) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser ? storedUser.token : null;
  
    fetch( `${API_BASE_URL}/users/update-user-data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar los datos del usuario");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos actualizados:", data);

        const fullName = `${data.name} ${data.lastName}`;

        const updatedUser = {
          ...data,
          fullName,
          token: storedUser.token, // Mantener el token actual si no cambia
        };

        setUser(updatedUser); // Actualizar el contexto global con los nuevos datos
        const lo = localStorage.setItem("user", JSON.stringify(updatedUser)); // Actualizar localStorage
        console.log("Usuario actualizado:", lo);
      })
      .catch((error) => console.error("Error al actualizar los datos:", error));
  };

  return (
    <div className="container-profile-ppal">
      {/* <div className="user-avatar-container">
        <UserAvatar userName={user.name} />
      </div> */}
      <div className="back-button-profile">
        <BackButton />
      </div>
      <div className="container-profile">
        <img
          className="image-account"
          src="public/images/perfil/perfil.jpg"
          alt="Imagen de perfil"
        />
        <div className="subContainer-profile">
          <span className="title-account">
            {user.name} {user.lastName}
          </span>
          <FormsUser user={user} onSubmit={handleUpdateUser} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;