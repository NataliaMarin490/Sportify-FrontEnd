// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import "../Styles/sidebar.css"; 
import {
  FaLayerGroup,
  FaList,
  FaUsers,
  FaCog,
} from "react-icons/fa"; 


const adminRoutes = { // Objeto con las rutas de administración
  courts: "/administracion",
  categories: "/administracion/categories",
  users: "/administracion/users",
  features: "/administracion/features",
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menú</h2> 
      <ul>
        <li>
          <Link to={adminRoutes.courts}>
            <FaLayerGroup className="icon"/> Productos
          </Link>
        </li>
        <li>
          <Link to={adminRoutes.categories}>
            <FaList className="icon"/> Categorías
          </Link>
        </li>
        <li>
          <Link to={adminRoutes.users}>
            <FaUsers className="icon"/> Usuarios
          </Link>
        </li>
        <li>
          <Link to={adminRoutes.features}>
            <FaCog className="icon"/> Características
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

export { adminRoutes }; // Exportamos el objeto para usarlo en Layout.js