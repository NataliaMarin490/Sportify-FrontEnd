import "../Styles/formsUser.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const FormsUser = ({ user = {}, onSubmit }) => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/createAccount";
  const [isEditing, setIsEditing] = useState(Object.keys(user).length === 0);
  const [userData, setUserData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phone: user.phone || "",
    city: user.city || "",
    fechaNacimiento: user.fechaNacimiento || "",
    password: user.password || "",
    confirmpassword: user.confirmpassword || "",
  });
  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    fechaNacimiento: "",
    password: "",
    confirmpassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
    if (!userData.phone) {
      newErrors.phone = "El número celular es obligatorio";
    } else if (isNaN(userData.phone)) {
      newErrors.phone = "El número celular debe ser solo numérico";
    }

    if (!userData.email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!userData.city) {
      newErrors.city = "La ciudad es obligatoria";
    }
    if (!userData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    }

    // Validación de la contraseña (mínimo 6 caracteres)
    if (!userData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (userData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (userData.password !== userData.confirmpassword) {
      newErrors.confirmpassword = "Las contraseñas no coinciden";
    }

    // Si hay errores, no enviamos el formulario
    if (Object.keys(newErrors).length > 0) {
      setSuccessMessage("Revisa los datos ingresados");
      console.log(newErrors);
      setErrors(newErrors);
      return;
    }

    // Si no hay errores, proceder con el submit
    // Llamar a la función onSubmit para enviar los datos
    onSubmit(userData);

    // Mostrar mensaje de éxito
    isRegisterPage
      ? setSuccessMessage("Usuario Registrado Correctamente!")
      : setSuccessMessage("Datos Actualizados Correctamente!");

    // Limpiar el formulario
    setUserData({
      name: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      fechaNacimiento: "",
      password: "",
      confirmpassword: "",
    });

    // Desactivar el modo de edición
    setIsEditing(false);
  };

  return (
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
          disabled={!isEditing}
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
          disabled={!isEditing}
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
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
          name="phone"
          placeholder="ej. +XXX XXXX XXXX"
          value={userData.phone}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
        {errors.phone && <p className="error-message">{errors.phone}</p>}
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
          name="fechaNacimiento"
          placeholder="ej. 01/01/2000"
          value={userData.fechaNacimiento}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
        {errors.fechaNacimiento && (
          <p className="error-message">{errors.fechaNacimiento}</p>
        )}
      </div>

      {/* Campo Ciudad*/}
      <div
        className={`input-container ${
          isRegisterPage ? "input-color-create" : "input-color-profile"
        }`}
      >
        <label className="label">Ciudad</label>
        <input
          className={`entrada-registrer ${
            isRegisterPage ? "border-green-500" : "border-red-500"
          }`}
          type="text"
          name="city"
          placeholder="ej. Medellín"
          value={userData.city}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
        {errors.fechaNacimiento && (
          <p className="error-message">{errors.fechaNacimiento}</p>
        )}
      </div>

      {/* Campo Contraseña */}
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
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>

      {/* Campo Confirmar Contraseña */}
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

      {/* Botón de Submit */}
      {isEditing ? (
        <button
          type="submit"
          className={`button-account ${
            isRegisterPage ? "button-create" : "button-edit"
          }`}
        >
          {Object.keys(user).length === 0 ? "Registrar" : "Guardar"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={`button-account ${
            isRegisterPage ? "border-green-500" : "border-red-500"
          }`}
        >
          Editar
        </button>
      )}

      {/* Mensaje de éxito */}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </form>
  );
};

export default FormsUser;
