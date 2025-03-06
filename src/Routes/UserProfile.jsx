import { useContextGlobal } from "../Context/global.context";
import { useEffect } from "react";
/* import { useContext } from "react"; */
import BackButton from "../components/BackButton";
import "../Styles/userProfile.css";
import FormsUser from "../components/FormsUser";
import UserAvatar from "../components/UserAvatar";

const UserProfile = () => {
  const { user, setUser } = useContextGlobal();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="container-profile-ppal">
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
        />
        <div className="subContainer-profile">
          <span className="title-account">
            {user.name} {user.lastName}
          </span>
          <FormsUser user={user} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
