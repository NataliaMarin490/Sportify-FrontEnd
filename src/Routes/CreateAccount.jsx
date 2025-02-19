import "../Styles/createAccount.css";

const CreateAccount = () => {
  /*const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", formData);
  };*/

  return (
    <div className="account-container">
      <form
        className="form" //</div>onSubmit={handleSubmit}
      >
        <h2>Crear Cuenta</h2>
        <div className="input-container">
          <label>Nombre Completo</label>
          <input
            className="entrada"
            type="text"
            name="name"
            // value={formData.name}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Apellidos</label>
          <input
            className="entrada"
            type="text"
            name="name"
            // value={formData.name}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Correo electrónico</label>
          <input
            className="entrada"
            type="email"
            name="email"
            //value={formData.email}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Contraseña</label>
          <input
            className="entrada"
            type="password"
            name="password"
            //value={formData.password}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Confirma Contraseña</label>
          <input
            className="entrada"
            type="password"
            name="password"
            //value={formData.password}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Fecha Nacimiento</label>
          <input
            className="entrada"
            type="date"
            name="birthdate"
            //value={formData.password}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Ciudad</label>
          <input
            className="entrada"
            type="text"
            name="city"
            //value={formData.password}
            //onChange={handleChange}
            required
          />
        </div>
        <div className="input-container">
          <label>Tipo de Usuario</label>
          <select
            name="role" //</div>value={formData.role} onChange={handleChange}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button>Registrarse</button>
      </form>
    </div>
  );
};

export default CreateAccount;
