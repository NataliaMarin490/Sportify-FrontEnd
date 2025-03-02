import "../Styles/formsUser.css";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const FormsUser = ({ user = {}, onSubmit }) => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/createAccount";
  const [isEditing, setIsEditing] = useState(Object.keys(user).length === 0);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});

  const [userData, setUserData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    cityId: user.cityId || "",
    birthdate: user.birthdate || "",
    password: user.password || "",
    confirmpassword: user.confirmpassword || "",
    country: user.country || "",
    region: user.region || "",
  });

  useEffect(() => {
    setUserData((prevState) => ({
      ...prevState,
      name: user?.name || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      cityId: user?.cityId || "",
      birthdate: user?.birthdate || "",
      password: user?.password || "",
      confirmpassword: user?.confirmpassword || "",
      country: user?.country ? String(user.country) : "",
      region: user?.region || "",
    }));
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:8080/api/countries/search")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (userData.country) {
      fetch(`http://localhost:8080/api/regions/by-country/${userData.country}`)
        .then((response) => response.json())
        .then((data) => setRegions(data))
        .catch((error) => console.error("Error fetching regions:", error));
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [userData.country]);

  useEffect(() => {
    if (userData.region) {
      fetch(`http://localhost:8080/api/cities/by-region/${userData.region}`)
        .then((response) => response.json())
        .then((data) => setCities(data))
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
  }, [userData.region]);


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


    if (!userData.cityId) {
      newErrors.cityId = "La ciudad es obligatoria";
    }
    if (!userData.birthdate) {
      newErrors.birthdate = "La fecha de nacimiento es obligatoria";

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
      phoneNumber: "",
      cityId: "",
      birthdate: "",
      password: "",
      confirmpassword: "",
      country: "",
      region: "",
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
          name="phoneNumber"
          placeholder="ej. +XXX XXXX XXXX"
          value={userData.phoneNumber}

          onChange={handleChange}
          disabled={!isEditing}
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
          disabled={!isEditing}
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
            disabled={!isEditing}
          >
            {isEditing || isRegisterPage ? (
              <>
                <option value="">Selecciona un país</option>
                {countries.map((country) => (
                  <option key={country.idCountry} value={country.idCountry}>
                    {country.countryName}
                  </option>
                ))}
              </>
            ) : (
              <>
                {countries.map((country) =>
                  parseInt(country.idCountry) === parseInt(userData.country) ? (
                    <option key={country.idCountry} value={country.idCountry}>
                      {country.countryName}
                    </option>
                  ) : null
                )}
              </>
            )}
          </select>
        </label>
      </div>

      {/* Campo Region*/}
      <div
        className={`input-container ${
          isRegisterPage ? "input-color-create" : "input-color-profile"
        }`}
      >
        <label className="label">
          Región/Estado:
          <select
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            name="region"
            value={userData.region}
            onChange={handleChange}
            required
            disabled={!isEditing}
          >
            {isEditing || isRegisterPage ? (
              <>
                <option value="">Selecciona una región</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </>
            ) : (
              <>
                {regions.map((region) =>
                  region.id === userData.region ? (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ) : null
                )}
              </>
            )}
          </select>
        </label>
      </div>


      {/* Campo Ciudad*/}
      <div
        className={`input-container ${
          isRegisterPage ? "input-color-create" : "input-color-profile"
        }`}
      >

        <label className="label">
          Ciudad:
          <select
            className={`entrada-registrer ${
              isRegisterPage ? "border-green-500" : "border-red-500"
            }`}
            name="cityId"
            value={userData.cityId}
            onChange={handleChange}
            required
            disabled={!isEditing}
          >
            {isEditing || isRegisterPage ? (
              <>
                <option value="">Selecciona una ciudad</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </>
            ) : (
              <>
                {cities.map((city) =>
                  city.id === userData.cityId ? (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ) : null
                )}
              </>
            )}
          </select>
        </label>

        {errors.cityId && <p className="error-message">{errors.cityId}</p>}

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
