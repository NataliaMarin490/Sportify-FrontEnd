import { useEffect, useState } from "react";
import { useContextGlobal } from "../Context/global.context";
/* import { Link } from "react-router-dom"; */
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
  const { state } = useContextGlobal();
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(state?.courts?.currentPage || 1 );
  const [currentCourts, setCurrentCourts] = useState([]);
  const [error, setError] = useState(null); // Estado para errores
  const [categories, setCategories] = useState([]);

  /* const newDataCourt = state?.courts?.data; */
  const itemsPerPage = state?.courts?.pageSize || 10;
  const totalPages = state?.courts?.totalPages;

  const token = localStorage.getItem("authToken");
 /*  console.log("Token:", token); */

  useEffect(() => {
    // Limpiar la categoría seleccionada al refrescar la página
    localStorage.removeItem("selectedCategory");
    setSelectedCategory(null);
    setFilteredCourts([]);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sports/status/5`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
  }, []);

  // useEffect para manejar la categoría seleccionada y la carga de canchas
useEffect(() => {
  if (selectedCategory && !isNaN(selectedCategory)) {
    axios
      .get(`${API_BASE_URL}/bookings/search?page=1&size=10&sportId=${selectedCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const courts = response.data.data || [];
        setFilteredCourts(courts);
        setCurrentPage(1);
        setError(courts.length ? null : "No hay canchas disponibles para esta categoría.");
      })
      .catch((error) => {
        console.error("Error al obtener canchas por categoría:", error);
        setError("Error al obtener canchas. Intenta nuevamente.");
      });
  } else {
    setFilteredCourts([]); 
  }
}, [selectedCategory, token]); 

 
  

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(Number(storedCategory));
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".searcher-container");
    if (container && currentPage !== 1) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handleCategorySelect = (categoryName, sportId) => {
    if (!sportId) {
      console.error("El sportId es inválido:", sportId);
      return;
    }
  
    setSelectedCategory(sportId);
    localStorage.setItem("selectedCategory", sportId);
    setCurrentPage(1);
  
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
    axios
      .get(`${API_BASE_URL}/bookings/search?page=1&size=10&sportId=${sportId}`, {
        headers,
      })
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setCurrentCourts(response.data);
          setFilteredCourts(response.data);
        } else {
          setError("No hay canchas disponibles para esta categoría.");
          setFilteredCourts([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener canchas por categoría:", error);
        setError("Error al obtener canchas. Intenta nuevamente.");
      });
  };

  const handleSearch = (filters) => {
    console.log("Buscando con filtros:", filters);
  
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
    axios
      .get(`${API_BASE_URL}/bookings/search`, {
        params: filters,
        headers,
      })
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setFilteredCourts(response.data.data);
      })
      .catch((error) => {
        console.error("Error al buscar canchas:", error);
      });
  };
  

  // Determinar los datos a paginar según filtros aplicados
  /* const dataToPaginate = filteredCourts.length > 0 
    ? filteredCourts 
    : state?.courts?.data?.length > 0 
      ? state?.courts?.data 
      : state?.recommendedCourts || []; */

  /* useEffect(() => {
    if (filteredCourts.length > 0) {
      setCurrentCourts(filteredCourts);
    } else if (selectedCategory) {
      setCurrentCourts([]);
    } else {
      setCurrentCourts(state?.courts?.data || []);
    }
  }, [filteredCourts, selectedCategory, state]);  */

  // useEffect para paginar los datos
  useEffect(() => {
    if (!itemsPerPage || isNaN(itemsPerPage)) return;
    
    const dataToPaginate = filteredCourts.length > 0 
      ? filteredCourts 
      : state?.courts?.data?.length > 0 
        ? state?.courts?.data 
        : state?.recommendedCourts || [];

     if (!dataToPaginate.length) return;
  
     const indexOfLastCourt = Math.min(currentPage * itemsPerPage, dataToPaginate.length);
  const indexOfFirstCourt = Math.min(indexOfLastCourt - itemsPerPage, dataToPaginate.length);

    console.log("🚀 Current Page:", currentPage);
  console.log("🛠 Items per Page:", itemsPerPage);
  console.log("📊 Data to Paginate:", dataToPaginate.length);
  console.log("🔢 Slice indexes:", indexOfFirstCourt, indexOfLastCourt);
  console.log("📃 Courts on this page:", dataToPaginate.slice(indexOfFirstCourt, indexOfLastCourt));

    setCurrentCourts(dataToPaginate.slice(indexOfFirstCourt, indexOfLastCourt));
  }, [currentPage, filteredCourts, state?.courts?.data, state?.recommendedCourts, itemsPerPage]);   

  const handleFetchNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleFetchPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
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
          <SearchBox onSearch={handleSearch} />
          <div className="categories-container">
            <div className="categories-slider-container">
              <Slider {...settings}>
                {/* { state.courts && state?.courts?.data?.features?.map((category, index) => ( */}
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="category-button"
                    onClick={() => handleCategorySelect(category.name, category.id)}
                  >
                    <i className={`fa ${category.icon} category-icon`}></i>
                    <span>{category.name}</span>
                  </button>
                ))}
              </Slider>
            </div>
          </div>

          
        </div>
      </div>
      <main>
        <div className="main-content">
        <h1>
  {selectedCategory
    ? `CANCHAS DE ${categories.find(c => c.id === selectedCategory)?.name.toUpperCase() || "DESCONOCIDO"}`
    : "NUESTRAS RECOMENDACIONES"}
</h1>


          <div className="home-cards-container">
            {error ? (
              <h1>{error}</h1>
            ) : currentCourts && currentCourts.length > 0 ? (
              currentCourts.map((court) => (
                <Cards key={court.id} court={court} />
              ))
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