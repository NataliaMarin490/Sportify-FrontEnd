import { useState } from "react";
import axios from "axios";

const useLogin = (onLogin) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

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

    // Simulación con json-server

    /* try {
      const response = await axios.get("http://localhost:8080/users"); 
      const user = response.data.find(
        (u) => u.email_address === formData.email && u.user_password === formData.password
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        onLogin(user);
      } else {
        setError("Credenciales incorrectas. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    }
  }; */

  try {
    const response = await axios.post("http://localhost:8080/api/auth/login", formData);

    if (response.data && response.data.token) {
      
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      
      onLogin(response.data.user);
    } else {
      setError("Error al procesar la respuesta del servidor.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Alguno de los dates es incorrecto. Inténtalo de nuevo.");
  }
};

  return {
    formData,
    error,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
