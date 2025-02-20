import { useEffect } from "react";
import { useContextGlobal } from "../Context/global.context";
import "../Styles/home.css";
import Cards from "../components/Cards";
import Recommendations from "../components/Recommendations";

const Home = () => {
  const { state } = useContextGlobal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="searcher-container">
          <div className="main-text-container">
            <h1>CANCHAS DEPORTIVAS</h1>
            <p className="text">
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
        <div className="extra-info-container">
          <div className="box-1">
            <h4 className="box-title">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
            <p className="text">
              Conoce aquí las canchas más populares dentro de nuestros usuarios.
            </p>
            <img
              alt="arrow"
              src="../../public/right-arrow.png"
              className="right-arrow"
            />
          </div>
          <div className="box-2">
            <h4 className="box-title">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
            <p className="text">
              Conoce aquí las canchas más populares dentro de nuestros usuarios.
            </p>
            <img
              alt="arrow"
              src="../../public/right-arrow.png"
              className="right-arrow"
            />
          </div>
          <div className="box-1">
            <h4 className="box-title">NUESTRAS CANCHAS MÁS RESERVADAS</h4>
            <p className="text">
              Conoce aquí las canchas más populares dentro de nuestros usuarios.
            </p>
            <img
              alt="arrow"
              src="../../public/right-arrow.png"
              className="right-arrow"
            />
          </div>
        </div>
      </div>
      <main>
        <div className="main-content">
          <div className="home-cards-container">
            {state.courts.map((court) => (
              <Cards key={court.id} court={court} />
            ))}
          </div>
        </div>
        <div className="home-recommendations-container">
          <h4 className="recommendations-title">
            NUESTRAS CANCHAS MÁS RESERVADAS
          </h4>
          <p className="recommendations-text">
            Conoce aquí las canchas más populares dentro de nuestros usuarios.
          </p>
          <Recommendations courts={state.courts} />
        </div>
      </main>
    </>
  );
};

export default Home;
