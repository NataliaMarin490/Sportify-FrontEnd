/* eslint-disable react/prop-types */
import "../Styles/formsUser.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../config";
import { sendEmail } from "../components/SendEmail.jsx";

const FormsUser = ({ user = {}, onSubmit }) => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/createAccount";
  const [isEditing, setIsEditing] = useState(true);
  const [countries, setCountries] = useState([]);
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);
  const [emailForResend, setEmailForResend] = useState(""); // Estado para guardar el correo ingresado para reenviar
  const [isResendVisible, setIsResendVisible] = useState(false); // Para controlar si se muestra el formulario de reenvío
  const [hasReceivedEmail, setHasReceivedEmail] = useState(null); // Estado para saber si el usuario recibió el correo
  const [modalVisible, setModalVisible] = useState(false); // Para controlar la visibilidad del modal

  const [userData, setUserData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    birthdate: user.birthdate || "",
    password: user.password || "",
    confirmpassword: user.confirmpassword || "",
    country: user.country || "",
  });

  const [hasChanges, setHasChanges] = useState(false); 

  useEffect(() => {
    setUserData({
      name: user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      birthdate: user.birthdate || "",
      password: "",
      confirmpassword: "",
      country: user.country ? String(user.country) : "",
    });
    setErrors({});
    setHasChanges(false); 
  }, [user]);

  useEffect(() => {
    setIsEditing(Object.keys(user).length === 0);
  }, [user]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/countries/search`)
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (isRegisterPage) {
      return;
    }
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).token : null;
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    fetch(`${API_BASE_URL}/users/currentUser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUserData({
          name: data.name || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          birthdate: data.birthdate || "",
          password: "",
          confirmpassword: "",
          country: data.country,
        });
        setIsEditing(false);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      // Detectar si hay cambios comparando con los datos originales
      const hasChanges = Object.keys(updatedData).some(
        (key) => updatedData[key] !== user[key]
      );
      setHasChanges(hasChanges);
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Inicializar los errores vacíos
    let newErrors = {};

    // Validaciones de campos
    if (!userData.name) {
      newErrors.name = "El nombre es obligatorio";
    } else if (userData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!userData.lastName) {
      newErrors.lastName = "Los apellidos son obligatorios";
    } else if (userData.lastName.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    // Validación de teléfono: solo número y obligatorio

    if (!userData.phoneNumber) {
      newErrors.phoneNumber = "El número celular es obligatorio";
    } else if (isNaN(userData.phoneNumber)) {
      newErrors.phoneNumber = "El número celular debe ser solo numérico";
    }

    if (!userData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!userData.country) {
      newErrors.country = "El país es obligatorio";
    }
    if (!userData.birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es obligatoria";
    }

    // Validación de la contraseña (mínimo 6 caracteres)
    if (isRegisterPage) {
      // Validaciones adicionales para registro
      if (!userData.password) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (userData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
  
      if (userData.password !== userData.confirmpassword) {
        newErrors.confirmpassword = "Las contraseñas no coinciden";
      }
    }

    // Si hay errores, no enviamos el formulario
    if (Object.keys(newErrors).length > 0) {
      setSuccessMessage("Revisa los datos ingresados");
      console.log(newErrors);
      setErrors(newErrors);
      return;
    }

    if (isRegisterPage) {
      // Si es la página de registro, enviar todos los datos
      onSubmit(userData);
    } else {
      // Si es la página de edición, enviar solo los campos modificados
      const updatedData = {};
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== user[key]) {
          updatedData[key] = userData[key];
        }
      });
      onSubmit(updatedData);
    }

    /*if (Object.keys(updatedData).length > 0) {
      onSubmit(updatedData);
      setSuccessMessage("Datos actualizados correctamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setHasChanges(false); // Reiniciar el estado de cambios
    }*/

    // Mostrar mensaje de éxito
    isRegisterPage
      ? setSuccessMessage("Usuario Registrado Correctamente!")
      : setSuccessMessage("Datos Actualizados Correctamente!");


    if (isRegisterPage) { 
      const userToSend = {
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber,
        birthdate: userData.birthdate,
        countryId: parseInt(userData.country, 10),
      };

      fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToSend),
      })
        .then((response) => {
          if (!response.ok)
          {
            setSuccessMessage("Error al crear el nuevo usuario");  
            throw new Error("Error en el registro");
          }
          return response.text();
        })
        .then((data) => {
          setSuccessMessage("Usuario registrado correctamente!");

          console.log(userData.name);

          // Llamar a la función para enviar el correo sin await
          sendEmail(userData.email, userData.name)
            .then((emailSent) => {
              if (emailSent) {
                console.log("Correo de bienvenida enviado correctamente.");
              } else {
                console.log("Hubo un problema al enviar el correo.");
              }
            })
            .catch((error) => console.error("Error enviando el correo:", error));

          setUserData({
            name: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
            password: "",
            confirmpassword: "",
            country: "",
          });
          setErrors({});
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((error) => {
          console.error("Error en el registro:", error);
        });
    }

  };

  const handleResendEmail = () => {
    // Mostrar el formulario para que el usuario ingrese un correo
    setModalVisible(true);
  };

  const handleResendSubmit = () => {
    if (!/\S+@\S+\.\S+/.test(emailForResend)) {
      setErrors({ email: "Correo electrónico inválido" });
      return;
    }

    // Llamar a la función para reenviar el correo con el nuevo correo proporcionado
    sendEmail(emailForResend, userData.name)
      .then((emailSent) => {
        if (emailSent) {
          console.log("Correo de bienvenida reenviado correctamente.");
          //setSuccessMessage("Correo de bienvenida reenviado correctamente.");
          setEmailSent(true); // Cambiar el estado cuando el correo se haya reenviado
        } else {
          console.log("Hubo un problema al reenviar el correo.");
        }
      })
      .catch((error) => console.error("Error reenviando el correo:", error));
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    // Cerrar el modal sin hacer nada
    setModalVisible(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`form-account ${
          isRegisterPage ? "form-width-create" : "form-width-profile"
        }`}
      >
        {/* Campo Nombres */}
        <div
          className={`input-container ${
            isRegisterPage ? "input-color-create" : "input-color-profile"
          }`}
        >
          <label className="label">Nombres</label>
          <input
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            type="text"
            name="name"
            placeholder="ej. Juan Miguel"
            value={userData.name}
            onChange={handleChange}
            //disabled={!isEditing}
            required
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* Campo Apellidos */}
        <div
          className={`input-container ${
            isRegisterPage ? "input-color-create" : "input-color-profile"
          }`}
        >
          <label className="label">Apellidos</label>
          <input
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            type="text"
            name="lastName"
            placeholder="ej. Pérez Rodríguez"
            value={userData.lastName}
            onChange={handleChange}
            //disabled={!isEditing}
            required
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>

        {/* Campo Correo Electrónico */}
        <div
          className={`input-container ${
            isRegisterPage ? "input-color-create" : "input-color-profile"
          }`}
        >
          <label className="label">Correo electrónico</label>
          <input
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            type="email"
            name="email"
            placeholder="ej. ejemplo@gmail.com"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Campo Teléfono */}
        <div
          className={`input-container ${
            isRegisterPage ? "input-color-create" : "input-color-profile"
          }`}
        >
          <label className="label">Número celular</label>
          <input
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            type="tel"
            name="phoneNumber"
            placeholder="ej. +XXX XXXX XXXX"
            value={userData.phoneNumber}
            onChange={handleChange}
            //disabled={!isEditing}
            required
          />
          {errors.phoneNumber && (
            <p className="error-message">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Campo Fecha Nacimiento */}
        <div
          className={`input-container ${
            isRegisterPage ? "input-color-create" : "input-color-profile"
          }`}
        >
          <label className="label">Fecha Nacimiento</label>
          <input
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            type="date"
            name="birthdate"
            placeholder="ej. 01/01/2000"
            value={userData.birthdate}
            onChange={handleChange}
            //disabled={!isEditing}
            required
          />

          {errors.birthdate && (
            <p className="error-message">{errors.birthdate}</p>
          )}
        </div>

        {/* Campo Paìs*/}
        <div
          className={`input-container ${
            isRegisterPage ? "input-color-create" : "input-color-profile"
          }`}
        >
          <label className="label">
            País:
            <select
              className={`entrada-registrer ${
                isRegisterPage ? "border-green-500" : "border-red-500"
              }`}
              name="country"
              value={userData.country}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un país</option>
              {countries.map((country) => (
                <option key={country.idCountry} value={country.idCountry}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        {/* Campo Contraseña */}
        {isRegisterPage && (
          <div
            className={`input-container ${
              isRegisterPage ? "input-color-create" : "input-color-profile"
            }`}
          >
            <label className="label">Contraseña</label>
            <input
              className={`entrada-registrer ${
                isRegisterPage ? "border-green-500" : "border-red-500"
              }`}
              type="password"
              name="password"
              placeholder="***********"
              value={userData.password}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>
        )}

        {/* Campo Confirmar Contraseña */}
        {isRegisterPage && (
          <div
            className={`input-container ${
              isRegisterPage ? "input-color-create" : "input-color-profile"
            }`}
          >
            <label className="label">Confirma Contraseña</label>
            <input
              className={`entrada-registrer ${
                isRegisterPage ? "border-green-500" : "border-red-500"
              }`}
              type="password"
              name="confirmpassword"
              placeholder="***********"
              value={userData.confirmpassword}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            {errors.confirmpassword && (
              <p className="error-message">{errors.confirmpassword}</p>
            )}
          </div>
        )}

        {/* Botón de Submit */}
        {isEditing ? (
          <button
            type="submit"
            className={`button-account ${
              isRegisterPage ? "button-create" : "button-edit"
            }`}
          >
            {Object.keys(user).length === 0 ? "Registrarse" : "Guardar"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`button-account ${
              !isRegisterPage && isEditing
                ? "border-green-500"
                : "border-red-500"
            }`}
            disabled={!hasChanges}
          >
            Guardar
          </button>
        )}


       

        {/* Mensaje de éxito */}
        {successMessage && <p className="success-message">{successMessage}</p>}

        {/* Pregunta si el usuario recibió el correo */}
        {true && (
          <div className="reenviar-contenedor">
            <p
              className={`input-container ${
                isRegisterPage ? "input-color-create" : "input-color-profile"
              }`}
            >
              ¿No has recibido el correo de bienvenida?
            </p>
            <button
              className={`button-account ${
                !isRegisterPage && isEditing
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              type="button"
              onClick={handleResendEmail}
            >
              No, no lo he recibido
            </button>
          </div>
        )}
      </form>
      {/* Modal de reenvío de correo */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className={`input-container ${
                isRegisterPage ? "input-color-create" : "input-color-profile"
              }`}
            >
              <label className="label">
                Ingresa tu correo para reenviar el mensaje:
              </label>
              <input
                className={`entrada-registrer ${
                  isRegisterPage ? "border-green-500" : "border-red-500"
                }`}
                type="email"
                value={emailForResend}
                onChange={(e) => setEmailForResend(e.target.value)}
                placeholder="Ingresa tu correo"
                required
              />
            </div>

            <button
              className={`button-account ${
                !isRegisterPage && isEditing
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              onClick={handleResendSubmit}
            >
              Enviar correo
            </button>
            <button
              className={`button-account ${
                !isRegisterPage && isEditing
                  ? "border-green-500"
                  : "border-red-500"
              }`}
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default FormsUser;
