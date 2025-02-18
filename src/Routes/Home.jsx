import "../Styles/home.css";

const Home = () => {
  return (
    <>
      <div className="searcher-container">
        <div className="main-text-container">
          <h1>CANCHAS DEPORTIVAS</h1>
          <p>
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
      <main>
        <h2>Contenido Principal</h2>
        <p>Aquí va la información básica de del sitio web.</p>
      </main>
    </>
  );
};

export default Home;
