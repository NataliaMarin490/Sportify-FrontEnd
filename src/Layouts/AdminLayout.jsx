import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContextGlobal } from "../Context/global.context";
import { useEffect } from "react";
import { adminRoutes } from "../components/Sidebar";
import Sidebar from "../components/Sidebar";
import "../Styles/adminLayout.css"; 

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
      <div className="adminLayout">
        {state.showSidebar && <Sidebar />}
        <div className="adminContent">
          <Outlet /> 
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
