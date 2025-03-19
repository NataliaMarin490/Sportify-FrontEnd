import { useState } from "react";
import "../Styles/calendar.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";

const CalendarPlain = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());

  const handleDateSelection = (selectedDate) => {
    setDate(selectedDate);
    onDateChange(selectedDate); // Llama a la función de `SearchBox`
  };
  

  return (
    <div className="search-calendar-container">
      {/* <h2 className="tituloCalendar">Seleccionar Fecha</h2> */}
      <Calendar onChange={handleDateSelection} value={date} className="search-custom-calendar" />

      
      

      {/* <p className="selected-info">
        📅 <strong>{date.toLocaleDateString()}</strong> - 🕒{" "}
        <strong>{hour}:00 {period}</strong>
      </p> */}
    </div>
  );
};

Calendar.propTypes = {
        onDateChange: PropTypes.func.isRequired,
      };

export default CalendarPlain;
