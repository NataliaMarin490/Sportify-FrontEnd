import { useState } from "react";
import "../Styles/calendar.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";

const CalendarPlain = ({ onDateChange }) => {
  const [date, setDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Asegurar comparación solo de fechas

  return (
    <div className="search-calendar-container calendar-instance">
      <Calendar
        onChange={(selectedDate) => {
          setDate(selectedDate);
          onDateChange(selectedDate);
        }}
        value={date}
        className="search-custom-calendar calendar-instance"
        minDate={today} // Evita bloquear el mes actual
        
      />
    </div>
  );
};


Calendar.propTypes = {
        onDateChange: PropTypes.func.isRequired,
      };

export default CalendarPlain;
