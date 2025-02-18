import "../Styles/home.css";
import Cards from "../components/Cards";
import Recommendations from "../components/Recommendations";
import { useRecipeStates } from "../Context/Context";

const Home = () => {
  const { state } = useRecipeStates();

  return (
    <>
      <div className="contenedor-padre">
        <div className="searcher-container">
          <div className="main-text-container">
            <h1>CANCHAS DEPORTIVAS</h1>
            <p className="Texto">
              Ofrecemos una amplia selección de canchas en todo el país, con
              precios <br />
              accesibles y condiciones óptimas para que disfrutes al máximo tu
              actividad física.
            </p>
          </div>
          <div className="searcher">
            <input name="address" type="text" placeholder="Dirección" />
            <input name="sport" type="text" placeholder="Deporte" />
            <input name="day" type="text" placeholder="Fecha" />
            <input name="hour" type="number" placeholder="Hora" />
            <button>Buscar</button>
          </div>
        </div>
        <div className="ContenedorInfo">
          <div className="Contenedor1">
            <h4 className="Titulo">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
            <p className="Texto">
              Conoce aquí las canchas más populares dentro de nuestros usuarios.
            </p>
          </div>
          <div className="Contenedor2">
            <h4 className="Titulo">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
            <p className="Texto">
              Conoce aquí las canchas más populares dentro de nuestros usuarios.
            </p>
          </div>
          <div className="Contenedor1">
            <h4 className="Titulo">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
            <p className="Texto">
              Conoce aquí las canchas más populares dentro de nuestros usuarios.
            </p>
          </div>
        </div>
      </div>
      <main>
        <div className="ContenedorPpal">
          <div className="ContenedorCards">
            {state.recipes.map((recipe) => (
              <Cards key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="TituloReco">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
          <p className="TextoReco">
            Conoce aquí las canchas más populares dentro de nuestros usuarios.
          </p>
          <div className="Reco">
            {state.recipes.map((recipe) => (
              <Recommendations key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
