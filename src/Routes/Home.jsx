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
  const [currentPage, setCurrentPage] = useState(
    state?.courts?.currentPage || 1
  );
  const [currentCourts, setCurrentCourts] = useState([]);
  const [error, setError] = useState(null); // Estado para errores
  const [categories, setCategories] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [courts, setCourts] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);

  const [loading, setLoading] = useState(false);

  /* const newDataCourt = state?.courts?.data; */
  const itemsPerPage = state?.courts?.pageSize || 10;
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("authToken");
  /*  console.log("Token:", token); */

  const fetchCourts = async (filters) => {
    setLoading(true);

    try {
      const params = { ...filters, page: currentPage, size: itemsPerPage };

      const response = await axios.get(
        "http://localhost:8080/api/bookings/search",
        {
          params,
        }
      );

      const data = response.data;

      if (!data.data.length) {
        setError("No se encontraron canchas para los filtros aplicados.");
        setFilteredCourts([]);
        return;
      }

      setCourts(data.data);
      setFilteredCourts(data.data);
      setError(null);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching canchas:", error);
      setError("Error al obtener canchas. Intenta nuevamente.");
      setFilteredCourts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Limpiar la categoría seleccionada al refrescar la página
    localStorage.removeItem("selectedCategory");
    setSelectedCategory(null);
    setFilteredCourts([]);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/public/sports/status/5`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/public/cities/all`)
      .then((response) => {
        setCities(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener ciudades:", error);
      });
  }, []);

  // useEffect para manejar la categoría seleccionada y la carga de canchas
  useEffect(() => {
    if (selectedCategory) {
      fetchCourts({ sportId: selectedCategory });
    } else {
      setFilteredCourts([]);
    }
  }, [selectedCategory, currentPage]);

  // useEffect para manejar la búsqueda con filtros
  useEffect(() => {
    if (isSearchActive) {
      const filters = {
        city: selectedCity,
        sport: selectedSport,
        date: selectedDate,
        hour: selectedHour,
      };

      setCurrentPage(1);
      fetchCourts(filters);
    }
  }, [
    isSearchActive,
    selectedCity,
    selectedSport,
    selectedDate,
    selectedHour,
    currentPage,
  ]);

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
    setSelectedCategory(sportId);
    setIsSearchActive(false);
    setCurrentPage(1);
    localStorage.setItem("selectedCategory", sportId);
  };

  const obtenerCityId = (cityName) => {
    console.log(cityName);
    if (!cityName || !cities.length) return null;
    const cityNameWithoutCountry = cityName.split(",")[0];
    const city = cities.find((c) =>
      c.name.toLowerCase().includes(cityNameWithoutCountry.toLowerCase())
    );
    console.log(city);
    return city ? city.id : null;
  };

  const obtenerSportId = (sportName) => {
    if (!sportName || !categories.length) return null; // Si el deporte no es válido, retorna null
    const sport = categories.find((s) => s.name === sportName);
    return sport ? sport.id : null;
  };

  const convertTo24HourFormat = (time) => {
    const [hour, minutePart] = time.split(":");
    const minute = minutePart.slice(0, 2);
    const period = minutePart.slice(3).toUpperCase();

    let hour24 = parseInt(hour);
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    return `${String(hour24).padStart(2, "0")}:${minute}`;
  };

  const handleSearch = ({ city, sport, date, hour }) => {
    setIsSearchActive(true);
    setCurrentPage(1);
    const filters = { city, sport, date, hour };

    console.log("Filtros de búsqueda:", filters);

    // Comprobar si los filtros tienen los valores correctos
    let searchParams = new URLSearchParams();

    if (filters.city) {
      const cityId = obtenerCityId(filters.city);
      if (cityId) {
        searchParams.append("cityId", cityId);
      }
    }

    if (filters.sport) {
      const sportId = obtenerSportId(filters.sport);
      if (sportId) {
        searchParams.append("sportId", sportId);
      }
    }

    if (filters.date) {
      const [day, month, year] = filters.date.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      searchParams.append("date", formattedDate);
    }

    if (filters.hour) {
      const militaryHour = convertTo24HourFormat(filters.hour);
      searchParams.append("time", militaryHour);
    }

    // Generar la URL con los parámetros de búsqueda
    const url = `http://localhost:8080/api/bookings/search?page=1&size=10&${searchParams.toString()}`;

    console.log("URL generada:", url);

    // Llamar a la API con la URL generada
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Resultados obtenidos:", data);
        if (data.data && data.data.length > 0) {
          setFilteredCourts(data.data);
          setCurrentPage(1); // Resetear la paginación a la página 1
          setTotalPages(data.totalPages); // Establecer el total de páginas
          setError(null);
        } else {
          setFilteredCourts([]);
          setError("No se encontraron canchas con los filtros seleccionados.");
        }
      })
      .catch((error) => {
        console.error("Error en la búsqueda:", error);
        setError("Error al obtener canchas. Intenta nuevamente.");
      });
  };

  // useEffect para paginar los datos
  useEffect(() => {
    const dataToPaginate = isSearchActive
      ? filteredCourts
      : state?.courts?.data || [];

    if (!dataToPaginate.length) return;

    const indexOfLastCourt = currentPage * itemsPerPage;
    const indexOfFirstCourt = indexOfLastCourt - itemsPerPage;

    setCurrentCourts(dataToPaginate.slice(indexOfFirstCourt, indexOfLastCourt));
  }, [
    currentPage,
    filteredCourts,
    state?.courts?.data,
    itemsPerPage,
    isSearchActive,
  ]);

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
            {/* Aseguramos que categories esté cargado antes de intentar renderizar el slider */}
            {categories.length > 0 ? (
              <div className="categories-slider-container">
                <Slider {...settings}>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="category-button"
                      onClick={() =>
                        handleCategorySelect(category.name, category.id)
                      }
                    >
                      <i className={`fa ${category.icon} category-icon`}></i>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </Slider>
              </div>
            ) : (
              <p>Cargando categorías...</p>
            )}
          </div>
        </div>
      </div>

      <main>
        <div className="main-content">
          <h1>
            {isSearchActive
              ? "RESULTADOS DE LA BÚSQUEDA"
              : selectedCategory
              ? `CANCHAS DE ${
                  categories
                    .find((c) => c.id === selectedCategory)
                    ?.name.toUpperCase() || "DESCONOCIDO"
                }`
              : "NUESTRAS RECOMENDACIONES"}
          </h1>

          {/* Mostrar cantidad de resultados si hay canchas */}
          {(isSearchActive || selectedCategory) && (
            <p>
              {filteredCourts.length > 0
                ? `Se encontraron ${filteredCourts.length} canchas disponibles.`
                : ""}
            </p>
          )}

          <div className="home-cards-container">
            {loading ? (
              <h1>Cargando...</h1>
            ) : error ? (
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
