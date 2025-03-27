import { useState } from "react";
import "../Styles/timePicker.css";
import "react-calendar/dist/Calendar.css";

const TimePicker = ({ onTimeChange }) => {
  const [hour, setHour] = useState(null);
  const [period, setPeriod] = useState(null);

  // Generar opciones de horas (del 1 al 12)
  const generateHourOptions = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      return hour < 10 ? `0${hour}` : `${hour}`;
    });
  };

  // Manejar cambio de hora al hacer clic
  const handleHourChange = (e) => {
    const selectedHour = e.target.value;
    setHour(selectedHour);
    onTimeChange(selectedHour, period); // Actualiza en SearchBox automáticamente
  };

  // Manejar cambio de AM/PM al hacer clic
  const handlePeriodChange = (e) => {
    const selectedPeriod = e.target.value;
    setPeriod(selectedPeriod);
    onTimeChange(hour, selectedPeriod); // Actualiza en SearchBox automáticamente
  };

  return (
      <div className="searcher-time-picker">
          <select value={hour || ""} onChange={handleHourChange}>
            <option value="" disabled>Hora</option> {/* Opción vacía */}
            {generateHourOptions().map((h) => (
              <option key={h} value={h}>
                {h}:00
              </option>
            ))}
          </select>
    
          <select value={period || ""} onChange={handlePeriodChange}>
            <option value="" disabled>AM/PM</option> {/* Opción vacía */}
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      );
    };
    
export default TimePicker;
