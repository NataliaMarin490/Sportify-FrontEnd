import { useState } from "react";
import "../Styles/timePicker.css";
/* import Calendar from "react-calendar"; */
import "react-calendar/dist/Calendar.css";

const TimePicker = ({ onTimeChange }) => {
  const [hour, setHour] = useState("12");
  const [period, setPeriod] = useState("AM");

  // Generar opciones de horas (del 1 al 12)
  const generateHourOptions = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      return hour < 10 ? `0${hour}` : `${hour}`;
    });
  };

  // Manejar cambio de hora
  const handleHourChange = (e) => {
    const selectedHour = e.target.value;
    setHour(selectedHour);
    onTimeChange(selectedHour, period); // Actualizar en SearchBox automáticamente
  };

  // Manejar cambio de AM/PM
  const handlePeriodChange = (e) => {
    const selectedPeriod = e.target.value;
    setPeriod(selectedPeriod);
    onTimeChange(hour, selectedPeriod); // Actualizar en SearchBox automáticamente
  };

  return (
    <div className="time-picker">
      <select value={hour} onChange={handleHourChange}>
        {generateHourOptions().map((h) => (
          <option key={h} value={h}>
            {h}:00
          </option>
        ))}
      </select>

      <select value={period} onChange={handlePeriodChange}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};
export default TimePicker;
