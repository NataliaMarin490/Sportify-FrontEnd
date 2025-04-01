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
      const response = await fetch(`${API_BASE_URL}/public/cities/all`);
      const data = await response.json();
      const formattedCities = data.map((city) => ({
        id: city.id,
        name: `${city.name}, ${city.region.country.countryName}`,
      }));

      setCities(formattedCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Función para obtener los deportes desde el backend
  const fetchSports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/sports/status/5`);
      const data = await response.json();
      setSports(data);
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
      filtered.length > 0 ? filtered : [{ name: "Sin coincidencias", id: -1 }]
    );
  }, [city, cities]);

  useEffect(() => {
    const filtered = sports.filter((s) =>
      s.name.toLowerCase().includes(sport.toLowerCase())
    );
    setFilteredSports(
      filtered.length > 0 ? filtered : [{ name: "Sin coincidencias", id: -1 }]
    );
  }, [sport, sports]);

  // Función para limpiar todos los filtros con flechita reset
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

  // Convertir hora a formato de 24 horas
  const convertTo24HourFormat = (time) => {
    if (!time || typeof time !== "string") return null; // Validación inicial
  
    const parts = time.split(" ");
    if (parts.length !== 2) return null; // Asegura que tiene la estructura "HH:MM AM/PM"
  
    const [hourMinute, period] = parts;
    const [hour, minute] = hourMinute.split(":");
  
    if (!hour || !minute || !period) return null; // Validación adicional
  
    let hour24 = parseInt(hour);
    if (period.toUpperCase() === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (period.toUpperCase() === "AM" && hour24 === 12) {
      hour24 = 0;
    }
  
    return `${String(hour24).padStart(2, "0")}:${minute.padStart(2, "0")}:00`;
  };
  
  // Función para manejar el cambio de hora
  const handleTimeChange = (selectedTime) => {
    console.log("Valor recibido en handleTimeChange:", selectedTime); // Depuración
  
    if (!selectedTime) return;
  
    setHour(selectedTime); // Se espera que selectedTime ya esté en formato de 24 horas
  
    setShowTimePicker(false);
    setActiveDropdown(null);
  };
  

  // Función para enviar los datos a Home.jsx
  const handleSearch = () => {
    const filters = { city, sport, date, hour };
    onSearch(filters);
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
            {filteredCities.map((c) => (
              <li
                key={c.id}
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
              setDate("");
              setShowCalendar(false);
            }}
          />
        )}
        {showCalendar && <CalendarPlain onDateChange={handleDateChange} />}
      </div>

      <div className="time-container">
        <input
          type="text"
          className="searcher-input"
          value={hour || ""}
          placeholder="Hora"
          readOnly
          onClick={() => setShowTimePicker(true)}
        />
        {hour && (
          <img
            src="../public/icons/dropdown-close-icon-2.svg"
            alt="Clear"
            className="icon-button"
            onClick={() => {
              setHour("");
              setShowTimePicker(false);
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
