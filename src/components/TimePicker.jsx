import { useState } from "react";
import "../Styles/timePicker.css";
import "react-calendar/dist/Calendar.css";

const TimePicker = ({ onTimeChange }) => {
  const [hour, setHour] = useState("");
  const [period, setPeriod] = useState("");

  // Generar opciones de horas (del 1 al 12)
  const generateHourOptions = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1;
      return hour < 10 ? `0${hour}` : `${hour}`;
    });
  };

  // Función para convertir la hora AM/PM a formato 24 horas
  const convertTo24HourFormat = (hour, period) => {
    let hour24 = parseInt(hour);
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12; // Convertir PM a formato 24h
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0; // Convertir 12 AM a 00:00
    }
    return `${String(hour24).padStart(2, "0")}:00:00`; // Formato 24 horas
  };

   // Función para actualizar el tiempo solo cuando ambas selecciones están listas
   const updateTime = (newHour, newPeriod) => {
    if (newHour && newPeriod) {
      const formattedTime = `${newHour}:00 ${newPeriod}`;
      console.log("Tiempo formateado:", formattedTime);
      onTimeChange(formattedTime); // Ahora enviamos un string bien formado
    }
  };

  // Manejar cambio de hora al hacer clic
  const handleHourChange = (e) => {
    const selectedHour = e.target.value;
    setHour(selectedHour);
    if (selectedHour && period) {
      updateTime(selectedHour, period); // Si ambos valores están listos, actualizamos el formato
    }
  };

  // Manejar cambio de AM/PM al hacer clic
  const handlePeriodChange = (e) => {
    const selectedPeriod = e.target.value;
    setPeriod(selectedPeriod);
    if (hour && selectedPeriod) {
      updateTime(hour, selectedPeriod); // Si ambos valores están listos, actualizamos el formato
    }
  };

  return (
      <div className="searcher-time-picker">
          <select value={hour} onChange={handleHourChange}>
            <option value="" disabled>Hora</option> {/* Opción vacía */}
            {generateHourOptions().map((h) => (
              <option key={h} value={h}>
                {h}:00
              </option>
            ))}
          </select>
    
          <select value={period} onChange={handlePeriodChange}>
            <option value="" disabled>AM/PM</option> {/* Opción vacía */}
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      );
    };
    
export default TimePicker;