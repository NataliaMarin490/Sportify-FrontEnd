import "../Styles/login.css";
import { Link } from "react-router-dom";

const Login = () => {
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
    <div className="login-container">
      <form
        className="form" //</div>onSubmit={handleSubmit}
      >
        <h2>Iniciar Sesión</h2>

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
        <label className="olvidaste">¿Olvidaste la contraseña?</label>
        <div className="recuerdame">
          <input type="checkbox" name="remember" />
          <label>Recuérdame</label>
        </div>
        <button className="botoninicio">Iniciar Sesión</button>
        <Link className="olvidaste" to="/CrearCuenta">¿Nuevo? Crear Cuenta Aquí</Link>
      </form>
    </div>
  );
};

export default Login;
