import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const useLogin = (onLogin) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
      console.log("Respuesta del backend:", response.data);

      if (response.data && response.data.token) {
        const userData = {
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role,
          token: response.data.token,
        };

        // Almacenar los datos de usuario y token en localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        console.log("Usuario autenticado:", userData);

      

        if (onLogin) {
          console.log("Ejecutando onLogin...");
          onLogin(
            userData
            /* {
            fullName: response.data.fullName,
            role: response.data.role,
            token: response.data.token,
          } */
          );
        } else {
          console.error("Error: onLogin no está definido");
        }

        console.log("Usuario autenticado con exito!!!:", userData);
      } else {
        setError("Error al procesar la respuesta del servidor.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Alguno de los datos es incorrecto. Inténtalo de nuevo."
      );
    }
  };

  // Redirigir al usuario después de iniciar sesión
  useEffect(() => {
    if (user) {
      const redirectUrl = localStorage.getItem("redirectToDetailView");

      if (redirectUrl) {
        const { courtId } = JSON.parse(redirectUrl);
        // Después de iniciar sesión, redirige al usuario a la página de detalle        
        navigate(`/detail/${courtId}`); // Redirigir a la página de detalle de la cancha
        localStorage.removeItem("redirectToDetailView");  // Limpiar la URL de redirección
      } else {
        // Si no hay página de detalle, redirigir al inicio
        navigate("/");
      }
    }
  }, [user, navigate]); // Ejecuta el efecto cuando `user` cambie


  return {
    formData,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;