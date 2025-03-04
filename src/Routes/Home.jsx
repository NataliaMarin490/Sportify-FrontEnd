import { useEffect } from "react";
import { useContextGlobal } from "../Context/global.context";
import "../Styles/home.css";
import Cards from "../components/Cards";
import Recommendations from "../components/Recommendations";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const { state } = useContextGlobal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    cssEase: "linear",
  };

  const categories = [
    {
      id: 1,
      name: "futbol",
      icon: "../public/icons/futbol-icon.svg",
    },
    {
      id: 2,
      name: "volley",
      icon: "../public/icons/volley-icon.svg",
    },
    {
      id: 3,
      name: "rugby",
      icon: "../public/icons/rugby.svg",
    },
    {
      id: 4,
      name: "basket",
      icon: "../public/icons/basket-icon.svg",
    },
  ];

  return (
    <>
      <div className="home-container">
        <div className="searcher-container">
          <div className="main-text-container">
            <h1>BIENVENIDO A SPORTIFY</h1>
            <p className="text">
              Ofrecemos una amplia selección de canchas en todo el país, con{" "}
              <br />
              precios accesibles y condiciones óptimas para que disfrutes al{" "}
              <br />
              máximo tu actividad física.
            </p>
          </div>
          <div className="searcher">
            <img
              className="filter-icon"
              src="../public/icons/filter-icon.svg"
              alt="filterIcon"
            />
            <select className="searcher-input" name="city" id="city-select">
              <option value="" disabled selected>
                Dirección
              </option>
            </select>
            <select className="searcher-input" name="sport" id="sport-select">
              <option value="" disabled selected>
                Deporte
              </option>
            </select>
            <select className="searcher-input" name="price" id="price-select">
              <option value="" disabled selected>
                Precio
              </option>
            </select>
            <select className="searcher-input" name="date" id="date-select">
              <option value="" disabled selected>
                Fecha
              </option>
            </select>
            <select className="searcher-input" name="hour" id="hour-select">
              <option value="" disabled selected>
                Hora
              </option>
            </select>
            <button className="searcher-button">Buscar</button>
          </div>
          <div className="categories-container">
            <div className="categories-slider-container">
              <Slider {...settings}>
                {categories.map((category, index) => (
                  <Link key={index} to={`/category/${category.id}`}>
                    <img
                      className="category-icon"
                      src={category.icon}
                      alt={category.name}
                    />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
      <main>
        <div className="main-content">
          <h1>NUESTRAS RECOMENDACIONES</h1>
          <div className="home-cards-container">
            {state.courts.map((court) => (
              <Cards key={court.id} court={court} />
            ))}
          </div>
        </div>
        <div className="extra-info-container">
          <div className="box-1">
            <h4 className="box-title">ENCUENTRA</h4>
            <p className="text">
              En Sportify tienes la posibilidad de encontrar la cancha que mejor
              se adapte a lo que buscas para disfrutar al alcance de un click.
            </p>
            <img
              alt="icon"
              src="../../public/icons/futbol-icon.svg"
              className="icon"
            />
          </div>
          <div className="box-2">
            <h4 className="box-title">RESERVA</h4>
            <p className="text">
              Sólo es necesario tener un usuario registrado para reservar la
              cancha que elijas en cualquiera de los horarios disponibles.
            </p>
            <img
              alt="icon"
              src="../../public/icons/basket-icon.svg"
              className="icon"
            />
          </div>
          <div className="box-1">
            <h4 className="box-title">JUEGA</h4>
            <p className="text">
              Y listo! Solo resta prepararte para jugar ese partido tan esperado
              junto con tus amigos{" "}
            </p>
            <img src="../../public/icons/tenis-icon.svg" className="icon" />
          </div>
        </div>
        <div className="home-recommendations-container">
          <h1 className="recommendations-title">
            NUESTRAS CANCHAS MÁS RESERVADAS
          </h1>
          <p className="recommendations-text">
            Conoce aquí las canchas más populares dentro de nuestros usuarios.
          </p>
          <Recommendations courts={state.recommendedCourts} />
        </div>
      </main>
    </>
  );
};

export default Home;
