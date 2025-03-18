import "../Styles/searchBox.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
/* import { Calendar } from 'primereact/calendar'; */
/* import Calendar from 'react-calendar'; */
import CalendarPlain from "./Calendar";
import TimePicker from "./TimePicker";
import API_BASE_URL from "../config";

const SearchBox = ({ onSearch }) => {
  // Estados locales para manejar las selecciones del usuario
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Estados para almacenar las opciones de ciudad y deporte
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);
  const [showSportsDropdown, setShowSportsDropdown] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState(null);

  // UseEffect para hacer las peticiones cuando el componente se monta
  useEffect(() => {
    fetchCities();
    fetchSports();
  }, []);

  // Función para obtener las ciudades desde el backend
  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities/all`);
      const data = await response.json();

      const formattedCities = data.map((city) => ({
        id: city.id,
        name: `${city.name}, ${city.region.country.countryName}`,
      }));

      setCities(formattedCities); // Asumiendo que la respuesta es un array de ciudades
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Función para obtener los deportes desde el backend
  const fetchSports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/status/5`);
      const data = await response.json();
      setSports(data); // Asumiendo que la respuesta es un array de deportes
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  // Filtrar ciudades y deporte cuando el usuario escribe
  useEffect(() => {
    const filtered = cities.filter((c) =>
      c.name.toLowerCase().includes(city.toLowerCase())
    );
    setFilteredCities(
      filtered.length > 0 ? filtered : [{ id: 0, name: "Sin coincidencias" }]
    );
  }, [city, cities]);

  useEffect(() => {
    const filtered = sports.filter((s) =>
      s.name.toLowerCase().includes(sport.toLowerCase())
    );
    setFilteredSports(
      filtered.length > 0 ? filtered : [{ id: 0, name: "Sin coincidencias" }]
    );
  }, [sport, sports]);

  // Función para limpiar todos los filtros con flechita
  const resetFilters = () => {
    setCity("");
    setSport("");
    setDate("");
    setHour("");
  };

  const resetField = (field) => {
    if (field === "city") {
      setCity("");
      setShowCitiesDropdown(false);
    }
    if (field === "sport") {
      setSport("");
      setShowSportsDropdown(false);
    }
  };

  // Función para manejar el cambio de fecha
  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate.toLocaleDateString();
    setDate(formattedDate);
    setShowCalendar(false);
    setActiveDropdown(null);
  };

  // Función para manejar el cambio de hora
  const handleTimeChange = (selectedHour, selectedPeriod) => {
    const formattedTime = `${selectedHour}:00 ${selectedPeriod}`;
    setHour(formattedTime);
    setShowTimePicker(false);
    setActiveDropdown(null);
  };

  // Función para enviar los datos a Home.jsx
  const handleSearch = () => {
    onSearch({ city, sport, date, hour });
  };

  // Manejo global para que se abran y cierren inputs

  const handleInputClick = (inputType) => {
    if (inputType === "city") {
      setShowCitiesDropdown((prev) => !prev);
      setShowSportsDropdown(false);
      setShowCalendar(false);
      setShowTimePicker(false);
    } else if (inputType === "sport") {
      setShowSportsDropdown((prev) => !prev);
      setShowCitiesDropdown(false);
      setShowCalendar(false);
      setShowTimePicker(false);
    } else if (inputType === "date") {
      setShowCalendar(true);
      setShowCitiesDropdown(false);
      setShowSportsDropdown(false);
      setShowTimePicker(false);
    } else if (inputType === "hour") {
      setShowTimePicker(true);
      setShowCitiesDropdown(false);
      setShowSportsDropdown(false);
      setShowCalendar(false);
    }
  };

  return (
    <div className="searcher">
      <img
        className="reset-icon"
        src="../public/icons/reset-icon-3.svg"
        alt="reset-search"
        onClick={resetFilters}
      />
      <div className="searcher-input-container">
        <input
          type="text"
          className="searcher-input"
          placeholder="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => handleInputClick("city")}
        />
        {city ? (
          <img
            src="../public/icons/dropdown-close-icon-2.svg"
            alt="Clear"
            className="icon-button"
            onClick={() => resetField("city")}
          />
        ) : (
          <img
            src="../public/icons/dropdown-arrow-icon-2.svg"
            alt="Dropdown"
            className="icon-button"
            onClick={() => handleInputClick("city")}
          />
        )}
        {showCitiesDropdown && (
          <ul className="dropdown">
            {filteredCities.map((c, index) => (
              <li
                key={index}
                onClick={() => {
                  if (c.name !== "Sin coincidencias") {
                    setCity(c.name);
                    setShowCitiesDropdown(false);
                  }
                }}
                className={
                  c.name === "Sin coincidencias" ? "disabled-option" : ""
                }
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="searcher-input-container">
        <input
          type="text"
          className="searcher-input"
          placeholder="Deporte"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          onFocus={() => handleInputClick("sport")}
        />
        {sport ? (
          <img
            src="../public/icons/dropdown-close-icon-2.svg"
            alt="Clear"
            className="icon-button"
            onClick={() => resetField("sport")}
          />
        ) : (
          <img
            src="../public/icons/dropdown-arrow-icon-2.svg"
            alt="Dropdown"
            className="icon-button"
            onClick={() => handleInputClick("sport")}
          />
        )}
        {showSportsDropdown && (
          <ul className="dropdown">
            {filteredSports.map((s) => (
              <li
                key={s.id}
                onClick={() => {
                  if (s.name !== "Sin coincidencias") {
                    setSport(s.name);
                    setShowSportsDropdown(false);
                  }
                }}
                className={
                  s.name === "Sin coincidencias" ? "disabled-option" : ""
                }
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="search-calendar-container">
        <input
          type="text"
          className="searcher-input"
          value={date}
          placeholder="Fecha"
          readOnly
          onClick={() => handleInputClick("date")}
        />
        {date && (
          <img
            src="../public/icons/dropdown-close-icon-2.svg"
            alt="Clear"
            className="icon-button"
            onClick={() => {
              setDate(""); // Resetea la fecha
              setShowCalendar(false); // Cierra el calendario
            }}
          />
        )}
        {showCalendar && <CalendarPlain onDateChange={handleDateChange} />}
      </div>

      <div className="time-container">
        <input
          type="text"
          className="searcher-input"
          value={hour}
          placeholder="Hora"
          readOnly
          onClick={() => handleInputClick("hour")}
        />
        {hour && (
          <img
            src="../public/icons/dropdown-close-icon-2.svg"
            alt="Clear"
            className="icon-button"
            onClick={() => {
              setHour(""); // Resetea la hora
              setShowTimePicker(false); // Cierra el selector de hora
            }}
          />
        )}
        {showTimePicker && (
          <div className="custom-timepicker">
            <TimePicker onTimeChange={handleTimeChange} />
          </div>
        )}
      </div>
      <button className="searcher-button" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBox;
