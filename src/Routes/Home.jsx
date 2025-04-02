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
import WhatsAppFloatButton from "../components/WhatsappFloatButton.jsx";

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

  useEffect(() => {
    let dataToPaginate = [];

    if (isSearchActive && filteredCourts.length > 0) {
      dataToPaginate = filteredCourts;
    } else if (selectedCategory && filteredCourts.length > 0) {
      dataToPaginate = filteredCourts;
    } else if (state?.courts?.data?.length > 0) {
      dataToPaginate = state.courts.data;
    }

    if (dataToPaginate.length > 0) {
      // Usar el totalPages del backend solo si no es una búsqueda o filtro
      const calculatedPages =
        isSearchActive || selectedCategory
          ? Math.ceil(dataToPaginate.length / itemsPerPage)
          : state?.courts?.totalPages || 1;

      setTotalPages(calculatedPages);
    } else {
      setTotalPages(1);
    }

    /* console.log(
      "📌 Total de páginas actualizado:",
      totalPages,
      "con",
      dataToPaginate.length,
      "elementos"
    ); */
  }, [
    filteredCourts,
    state?.courts?.data,
    state?.courts?.totalPages,
    itemsPerPage,
    isSearchActive,
    selectedCategory,
  ]);

  const fetchCourts = async (filters) => {
    setLoading(true);

    try {
      const params = { ...filters, page: currentPage, size: itemsPerPage };

      const response = await axios.get(`${API_BASE_URL}/bookings/search`, {
        params,
      });

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
    axios
      .get(`${API_BASE_URL}/public/sports/status/5`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener deportes:", error);
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

    fetchCourts({ sportId, page: 1 });
  };

  // Limpiar la categoría seleccionada al refrescar la página
  useEffect(() => {
    localStorage.removeItem("selectedCategory");
    setSelectedCategory(null);
    setFilteredCourts([]);
  }, []);

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

    const normalizedHour = hour ? normalizeHour(hour) : null;
    const filters = { city, sport, date, hour };

    console.log("Filtros de búsqueda:", filters);

    // Verificar si la hora seleccionada está dentro de un rango válido
    const isValidHour = (hour) => {
    const availableHours = ["07:00:00", "08:00:00", "09:00:00", "10:00:00", "11:00:00", "12:00:00", "13:00:00", "14:00:00", "15:00:00", "16:00:00", "17:00:00", "18:00:00", "19:00:00", "20:00:00", "21:00:00"];

    if (!hour) return false; // Verifica que hour no sea null o undefined

    // Normaliza la hora a formato HH:MM
    const [h, m] = hour.split(":"); 
    const formattedHour = `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
    //const formattedHour = convertTo24HourFormat(hour);
    

    console.log("Hora normalizada:", formattedHour); 
    return availableHours.includes(formattedHour);
    };

  // Si la hora no es válida, mostramos el error
  if (normalizedHour && !isValidHour(normalizedHour)) {
    setError("La hora seleccionada no está disponible. Por favor elige una hora dentro del rango disponible.");
    setFilteredCourts([]);
    return;
  }

  // Si la hora es válida, continuar con la búsqueda
  setError(null); // Limpiar el error si la hora es válida

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
      //const militaryHour = convertTo24HourFormat(filters.hour);
      //searchParams.append("time", militaryHour);
      searchParams.append("time", normalizedHour);
    }

    // Generar la URL con los parámetros de búsqueda
    const url = `${API_BASE_URL}/bookings/search?page=1&size=10&${searchParams.toString()}`;

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

  // Función para normalizar la hora a formato HH:mm:ss
  const normalizeHour = (hour) => {
    if (!hour) return null;
  
    // Verificar si la hora tiene formato AM/PM
    const amPmMatch = hour.match(/(\d+):(\d+) (AM|PM)/);
  
    if (amPmMatch) {
      let [_, h, m, period] = amPmMatch;
      h = parseInt(h, 10);
  
      if (period === "PM" && h !== 12) {
        h += 12;
      } else if (period === "AM" && h === 12) {
        h = 0;
      }
  
      return `${String(h).padStart(2, "0")}:${m.padStart(2, "0")}:00`;
    }
  
    // Si ya está en formato 24 horas, simplemente agregar ":00" si falta
    const hourMatch = hour.match(/(\d+):(\d+)/);
    if (hourMatch) {
      let [_, h, m] = hourMatch;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
    }
  
    return hour; // Si no coincide con ningún formato, devolver como está
  };
  
  // useEffect para paginar los datos
  useEffect(() => {
    let dataToPaginate = [];

    if (isSearchActive && filteredCourts.length > 0) {
      dataToPaginate = filteredCourts;
    } else if (selectedCategory && filteredCourts.length > 0) {
      dataToPaginate = filteredCourts;
    } else if (state?.courts?.data?.length > 0) {
      dataToPaginate = state.courts.data;
    }

    if (dataToPaginate.length === 0) return;

    const indexOfLastCourt = currentPage * itemsPerPage;
    const indexOfFirstCourt = indexOfLastCourt - itemsPerPage;

    const paginatedCourts = dataToPaginate.slice(
      indexOfFirstCourt,
      indexOfLastCourt
    );

    /* console.log("📌 Mostrando canchas de", indexOfFirstCourt, "a", indexOfLastCourt, "Total páginas:", totalPages); */
    setCurrentCourts(paginatedCourts);
  }, [
    currentPage,
    filteredCourts,
    state?.courts?.data,
    itemsPerPage,
    isSearchActive,
    selectedCategory,
    totalPages,
  ]);

  const handleFetchNextPage = () => {
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
        <WhatsAppFloatButton />
      </main>
    </>
  );
};

export default Home;