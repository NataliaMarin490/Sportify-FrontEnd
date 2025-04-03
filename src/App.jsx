import "./App.css";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Layout from "./Layouts/Layout ";
import Home from "./Routes/Home";
import Category from "./Routes/Category";
import Detail from "./Routes/Detail";
import CreateAccount from "./Routes/CreateAccount.jsx";
import Login from "./Routes/Login.jsx";
import CreateCourt from "./Routes/CreateCourt.jsx";
import EditCourt from "./Routes/CreateCourt.jsx";
import CreateFeatures from "./Routes/CreateFeatures";
import EditFeatures from "./Routes/CreateFeatures";
import CreateCategories from "./Routes/CreateCategories";
import EditCategories from "./Routes/CreateCategories";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UserProfile from "./Routes/UserProfile.jsx";
import AdminCourts from "./Routes/AdminCourts.jsx";
import AdminCategories from "./Routes/AdminCategories.jsx";
import AdminUsers from "./Routes/AdminUsers.jsx";
import AdminFeatures from "./Routes/AdminFeatures.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import FavoritesPage from "./Routes/FavoritesPage.jsx";
import UserBookingHistory from "./Routes/UserBookingHistory.jsx";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user:", storedUser); // Verifica si se está recuperando correctamente
    return storedUser ? JSON.parse(storedUser) : null;
  });

  /*  useEffect(() => {
    // Asegurarse de que el estado de 'user' siempre está sincronizado con localStorage
    const storedUser = localStorage.getItem("user");
    console.log("User desde localStorage:", storedUser);

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    console.log("Estado de user actualizado:", user);
  }, [user]);  */

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Guardamos el usuario en localStorage
    }
  }, [user]);

  // Manejar login
  const [pendingRedirect, setPendingRedirect] = useState(null);

  const handleLogin = (userData) => {
    console.log("Usuario autenticado:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Guardamos la ruta a la que se debe redirigir
    setPendingRedirect(location.state?.from || "/");
  };

  // Ejecutamos la redirección cuando el usuario esté completamente actualizado
  useEffect(() => {
    if (user && pendingRedirect) {
      navigate(pendingRedirect, { replace: true });
      setPendingRedirect(null); // Limpiamos la variable para evitar re-redirecciones
    }
  }, [user, pendingRedirect, navigate]);

  // Manejar logout
  const handleLogout = () => {
    console.log("Cerrando sesión...");

    setUser(null);
    localStorage.removeItem("user");
    console.log("Usuario después de logout:", user);

    console.log(
      "LocalStorage después de logout:",
      localStorage.getItem("user")
    );

    navigate("/"); // Redirigir al inicio después del logout
  };

  return (
    <ErrorBoundary>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/"
          element={<Layout user={user} onLogout={handleLogout} />}
        >
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/createAccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/create-court" element={<CreateCourt />} />
          <Route path="/edit-court/:id" element={<EditCourt />} />
          <Route path="/create-feature" element={<CreateFeatures />} />
          <Route path="/edit-feature/:id" element={<EditFeatures />} />
          <Route path="/create-categories" element={<CreateCategories />} />
          <Route path="/edit-categories/:id" element={<EditCategories />} />
          <Route path="/user-booking-history" element={<UserBookingHistory />} />

          {/* Ruta protegida para perfil de usuario */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                isAuthenticated={user}
                redirectTo={location.state?.from || "/"}
              >
                <UserProfile />
              </ProtectedRoute>
            }
          />
           {/* Ruta protegida para perfil de usuario */}
           

          {/* Ruta protegida para favoritos */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute
                isAuthenticated={user}
                redirectTo={location.state?.from || "/login"} // Redirigir a login si no está logueado
              >
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rutas de administración protegidas */}
        <Route
          path="/administracion"
          element={
            <ProtectedRoute isAuthenticated={user} redirectTo="/login">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminCourts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Redirigir rutas desconocidas al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  );
}
export default App;
