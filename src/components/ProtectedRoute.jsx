import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};


ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,  // Validar que 'children' es un nodo válido
    isAuthenticated: PropTypes.bool.isRequired, // Validar que 'isAuthenticated' es un booleano
    redirectTo: PropTypes.string.isRequired, // Validar que 'redirectTo' es una cadena
  };

export default ProtectedRoute;
