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
  const [currentPageBookings, setCurrentPageBookings] = useState(1);
  const [totalPagesBookings, setTotalPagesBookings] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
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
  }, [
    filteredCourts,
    state?.courts?.data,
    state?.courts?.totalPages,
    itemsPerPage,
    isSearchActive,
    selectedCategory,
  ]);

  useEffect(() => {
    setTotalPages(state?.courts?.totalPages || 1);
  }, [state?.courts?.totalPages]);

  useEffect(() => {
    setTotalPagesBookings(
      filteredBookings.length > 0
        ? Math.ceil(filteredBookings.length / itemsPerPage)
        : state?.bookings?.totalPages || 1
    );
  }, [filteredBookings, state?.bookings?.totalPages, itemsPerPage]);

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

  useEffect(() => {
    fetchBookings({
      city: selectedCity,
      sport: selectedSport,
      date: selectedDate,
      hour: selectedHour,
    });
  }, [
    currentPageBookings,
    selectedCity,
    selectedSport,
    selectedDate,
    selectedHour,
  ]);

  const fetchBookings = async (filters = {}) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: currentPage,
        size: itemsPerPage,
      };

      const response = await axios.get(`${API_BASE_URL}/bookings/search`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      if (!data.data || data.data.length === 0) {
        setError("No se encontraron reservas para los filtros aplicados.");
        setFilteredBookings([]);
        setTotalPagesBookings(1);
        setCurrentCourts([]);
        return []; // <-- añadimos esto
      } else {
        setBookings(data.data);
        setFilteredBookings(data.data);
        setFilteredCourts(data.data);
        setTotalPagesBookings(
          data.totalPages || Math.ceil(data.data.length / itemsPerPage)
        );
        setError(null);
        return data.data; // <-- añadimos esto
      }
    } catch (error) {
      console.error("Error fetching reservas:", error);
      setError("Error al obtener reservas. Intenta nuevamente.");
      setFilteredBookings([]);
      setTotalPagesBookings(1);
      setCurrentCourts([]);
      return []; // <-- añadimos esto
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearchActive) {
      fetchBookings({
        city: selectedCity,
        sport: selectedSport,
        date: selectedDate,
        hour: selectedHour,
      });
    }
  }, [
    isSearchActive,
    currentPageBookings,
    selectedCity,
    selectedSport,
    selectedDate,
    selectedHour,
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

  useEffect(() => {
    if (!isSearchActive && !selectedCategory) {
      fetch(
        `${API_BASE_URL}/bookings/search?page=${currentPage}&size=${itemsPerPage}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.data && Array.isArray(data.data)) {
            setCurrentCourts(data.data);
          } else {
            console.error(
              "Error: La respuesta del backend no tiene la estructura esperada o viene vacía"
            );
            setCurrentCourts([]);
          }

          setTotalPages(data?.totalPages || 1);
        })
        .catch((error) =>
          console.error("Error al obtener las canchas:", error)
        );
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (isSearchActive) {
      setCurrentCourts(filteredCourts);
    }
  }, [filteredCourts, isSearchActive]);

  useEffect(() => {
    if (selectedCategory) {
      setCurrentCourts(filteredBookings);
    }
  }, [filteredBookings, selectedCategory]);

  const handleCategorySelect = async (categoryName, sportId) => {
    setSelectedCategory(sportId);
    setIsSearchActive(false);
    setCurrentPage(1);
    localStorage.setItem("selectedCategory", sportId);

    await fetchBookings({ sportId, page: 1 });
    setCurrentCourts(filteredBookings);
  };

  // Limpiar la categoría seleccionada al refrescar la página
  useEffect(() => {
    localStorage.removeItem("selectedCategory");
    setSelectedCategory(null);
    setFilteredCourts([]);
  }, []);

  const obtenerCityId = (cityName) => {
    if (!cityName || !cities.length) return null;
    const cityNameWithoutCountry = cityName.split(",")[0];
    const city = cities.find((c) =>
      c.name.toLowerCase().includes(cityNameWithoutCountry.toLowerCase())
    );
    return city ? city.id : null;
  };

  const obtenerSportId = (sportName) => {
    if (!sportName || !categories.length) return null;
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

    const isValidHour = (hour) => {
      const availableHours = [
        "07:00:00",
        "08:00:00",
        "09:00:00",
        "10:00:00",
        "11:00:00",
        "12:00:00",
        "13:00:00",
        "14:00:00",
        "15:00:00",
        "16:00:00",
        "17:00:00",
        "18:00:00",
        "19:00:00",
        "20:00:00",
        "21:00:00",
      ];

      if (!hour) return false;

      const [h, m] = hour.split(":");
      const formattedHour = `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
      return availableHours.includes(formattedHour);
    };

    if (normalizedHour && !isValidHour(normalizedHour)) {
      setError(
        "La hora seleccionada no está disponible. Por favor elige una hora dentro del rango disponible."
      );
      setFilteredCourts(filteredBookings);
      setCurrentCourts(filteredBookings);
      return;
    }

    setError(null);

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
      searchParams.append("time", normalizedHour);
    }

    const url = `${API_BASE_URL}/bookings/search?page=1&size=10&${searchParams.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setFilteredCourts(data.data);
          setCurrentPage(1);
          setTotalPages(data.totalPages);
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

  useEffect(() => {
    if (isSearchActive || selectedCategory) {
      fetchBookings({
        city: selectedCity,
        sport: selectedSport || selectedCategory,
        date: selectedDate,
        hour: selectedHour,
      });
    } else {
      fetchBookings({ page: currentPage });
    }
  }, [currentPage]);

  const handleFetchNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(nextPage);
  };

  const handleFetchPrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
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
          {isSearchActive && !loading && (
            <>
              {currentCourts.length > 0 ? (
                <p>
                  Se encontraron {currentCourts.length} canchas disponibles.
                </p>
              ) : (
                <p>No se encontraron canchas para los filtros aplicados.</p>
              )}
            </>
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
