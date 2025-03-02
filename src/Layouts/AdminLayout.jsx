import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContextGlobal } from "../Context/global.context";
import { useEffect } from "react";
import { adminRoutes } from "../components/Sidebar";
import Sidebar from "../components/Sidebar";
import styles from "../Styles/adminLayout.module.css"; 

const AdminLayout = () => {
  const { state, toggleSidebar } = useContextGlobal();
  const location = useLocation();

  useEffect(() => {
    const isAdminRoute = Object.values(adminRoutes).some((route) =>
      location.pathname.startsWith(route)
    );
    toggleSidebar(isAdminRoute);
  }, [location.pathname, toggleSidebar]);

  return (
    <>
      <Header />
      <div className={styles["admin-layout"]}>
        {state.showSidebar && <Sidebar />}
        <div className={styles["admin-content"]}>
          <Outlet /> {/* Aquí se renderizan las rutas de Administración */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
