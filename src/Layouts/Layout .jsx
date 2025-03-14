import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";

const Layout = () => {
  const [user, setUser] = useState(null);

  // Cargar el usuario desde localStorage cuando la aplicación se monta
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Si hay un usuario guardado, establecerlo en el estado
    }
  }, []);

  // Manejar el login (cuando el usuario se loguea)
  const handleLogin = (userData) => {
    setUser(userData);  // Guardar el usuario en el estado
    localStorage.setItem("user", JSON.stringify(userData));  // Guardarlo en localStorage
  };

  // Manejar el logout (cuando el usuario se desloguea)
  const handleLogout = () => {
    setUser(null);  // Limpiar el estado
    localStorage.removeItem("user");  // Eliminar el usuario del localStorage
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout}  />
      {/* onLogin={handleLogin} */}
      
      <Outlet />
      
      <Footer />
    </>
  );
};

export default Layout;
