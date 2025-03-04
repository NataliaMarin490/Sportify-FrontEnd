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
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
