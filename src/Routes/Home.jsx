import { useEffect, useState } from "react";
import { useContextGlobal } from "../Context/global.context";
import { Link } from "react-router-dom";
import Cards from "../components/Cards";
import Recommendations from "../components/Recommendations";
import Slider from "react-slick";
import "../Styles/home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import API_BASE_URL from "../config";
import SearchBox from "../components/SearchBox";

const Home = () => {
  const [filteredCourts, setFilteredCourts] = useState([]);

  // Función que recibe los valores del buscador y hace la búsqueda en la API
  const handleSearch = (filters) => {
    console.log("Buscando con filtros:", filters);
    
    axios.get(`${API_BASE_URL}/courts/search`, { params: filters })
      .then(response => {
        console.log("Respuesta de la API:", response.data); 
        setFilteredCourts(response.data.data);
      })
      .catch(error => {
        console.error("Error al buscar canchas:", error);
      });
  };

  const { state, dispatch } = useContextGlobal();
  const [currentPage, setCurrentPage] = useState(
    state?.courts?.currentPage || 1
  );
  const [currentCourts, setCurrentCourts] = useState(state?.courts?.data);

  const newDataCourt = state?.courts?.data;
  const itemsPerPage = state?.courts?.pageSize;
  const totalPages = state?.courts?.totalPages;

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const indexOfLastCourt = currentPage * itemsPerPage;
    const indexOfFirstCourt = indexOfLastCourt - itemsPerPage;

    console.log(newDataCourt);
    console.log(currentCourts?.length);
    if (!currentCourts || currentCourts?.length === 0) {
      setCurrentCourts(
        state?.courts?.data?.slice(indexOfFirstCourt, indexOfLastCourt) || []
      );
    }
  }, [currentPage, state]);

  useEffect(() => {
    const container = document.querySelector(".searcher-container");
    if (container && currentPage !== 1) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handleFetchNextPage = () => {
    console.log("Prueba");
    const nextPage = Math.min(currentPage + 1, totalPages);
    axios
      .get(`${API_BASE_URL}/courts/search?page=${nextPage}&size=10`)
      .then((response) => {
        const court = {
          data: response.data.data,
          totalPages: response.data.totalPages,
          pageSize: response.data.pageSize,
          currentPage: response.data.currentPage,
        };

        setCurrentCourts(court.data);
      })
      .catch((error) => {
        console.error("Error al traer la siguiente página ", error);
      });

    setCurrentPage(nextPage);
  };

  const handleFetchPrevPage = () => {
    const prevPage = Math.min(currentPage - 1, totalPages);
    axios
      .get(`${API_BASE_URL}/courts/search?page=${prevPage}&size=10`)
      .then((response) => {
        const court = {
          data: response.data.data,
          totalPages: response.data.totalPages,
          pageSize: response.data.pageSize,
          currentPage: response.data.currentPage,
        };

        setCurrentCourts(court.data);
      })
      .catch((error) => {
        console.error("Error al traer la anterior página ", error);
      });

    setCurrentPage(prevPage);
  };

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
            <p className="text-welcome">
              Ofrecemos una amplia selección de canchas en todo el país, con{" "}
              <br />
              precios accesibles y condiciones óptimas para que disfrutes al{" "}
              <br />
              máximo tu actividad física.
            </p>
          </div>
          <div className="categories-container">
            <div className="categories-slider-container">
              <Slider {...settings}>
                {/* { state.courts && state?.courts?.data?.features?.map((category, index) => ( */}
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

          <SearchBox onSearch={handleSearch} />
                    
        </div>
      </div>
      <main>
        <div className="main-content">
          <h1>NUESTRAS RECOMENDACIONES</h1>
          <div className="home-cards-container">
          {filteredCourts.length > 0 ? (
            filteredCourts.map((court) => <Cards key={court.id} court={court} />)
          ) : currentCourts && currentCourts.length > 0 ? (
            currentCourts.map((court) => <Cards key={court.id} court={court} />)
          ) : (
            <h1>No hay canchas disponibles</h1>
          )}
          </div>
          <div className="home-cards-pagination">
            <button onClick={handleFetchPrevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleFetchNextPage}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
        <div className="extra-info-container">
          <div className="box-1">
            <h4 className="box-title">ENCUENTRA</h4>
            <p className="text-box">
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
            <p className="text-box">
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
            <p className="text-box">
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
