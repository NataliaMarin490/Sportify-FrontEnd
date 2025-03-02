// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "../Styles/Sidebar.module.css"; // Importa los estilos modulares
import {
  FaLayerGroup,
  FaList,
  FaUsers,
  FaCog,
} from "react-icons/fa"; // Íconos de react-icons


const adminRoutes = { // Objeto con las rutas de administración
  courts: "/administration",
  categories: "/administration/categories",
  users: "/administration/users",
  features: "/administration/features",
};

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Menú</h2>
      
      <ul>
        <li>
          <Link to={adminRoutes.courts}>
            <FaLayerGroup className={styles.icon} /> Productos
          </Link>
        </li>
        <li>
          <Link to={adminRoutes.categories}>
            <FaList className={styles.icon} /> Categorías
          </Link>
        </li>
        <li>
          <Link to={adminRoutes.users}>
            <FaUsers className={styles.icon} /> Usuarios
          </Link>
        </li>
        <li>
          <Link to={adminRoutes.features}>
            <FaCog className={styles.icon} /> Características
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

export { adminRoutes }; // Exportamos el objeto para usarlo en Layout.js