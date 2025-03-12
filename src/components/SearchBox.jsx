import "../Styles/searchBox.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SearchBox = ({ onSearch }) => {
  // Estados locales para manejar las selecciones del usuario
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  // Estados para almacenar las opciones de ciudad y deporte
  const [cities, setCities] = useState([]);
  const [sports, setSports] = useState([]);

  // Función para obtener las ciudades desde el backend
  const fetchCities = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/cities");
      const data = await response.json();
      setCities(data);  // Asumiendo que la respuesta es un array de ciudades
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Función para obtener los deportes desde el backend
  const fetchSports = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/sports");
      const data = await response.json();
      setSports(data);  // Asumiendo que la respuesta es un array de deportes
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  // UseEffect para hacer las peticiones cuando el componente se monta
  useEffect(() => {
    fetchCities();
    fetchSports();
  }, []);

  // Función para limpiar los filtros
  const resetFilters = () => {
    setCity("");
    setSport("");
    setDate("");
    setHour("");
  };

  // Función para manejar los cambios de los select
  /* const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "city") setCity(value);
    if (name === "sport") setSport(value);
    if (name === "date") setDate(value);
    if (name === "hour") setHour(value);
  }; */

  // Función para enviar los datos a Home.jsx
  const handleSearch = () => {
    onSearch({ city, sport, date, hour });
  };



return (
    <div className="searcher">
        <img
          className="reset-icon"
          src="../public/icons/reset-icon-3.svg"
          alt="reset-search"
          onClick={resetFilters}
        />
        <select
        className="searcher-input"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option value="" disabled>
          Ciudad
        </option>
        {cities.map((cityOption) => (
          <option key={cityOption} value={cityOption}>
            {cityOption}
          </option>
        ))}
      </select>

      <select
        className="searcher-input"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
      >
        <option value="" disabled>
          Deporte
        </option>
        {sports.map((sportOption) => (
          <option key={sportOption} value={sportOption}>
            {sportOption}
          </option>
        ))}
      </select>

      <input type="date" className="searcher-input" value={date} onChange={(e) => setDate(e.target.value)} />

      <input type="time" className="searcher-input" value={hour} onChange={(e) => setHour(e.target.value)} />
        <button className="searcher-button" onClick={handleSearch}>Buscar</button>
      </div>

      );
    };

    SearchBox.propTypes = {
        onSearch: PropTypes.func.isRequired,
      };

export default SearchBox;