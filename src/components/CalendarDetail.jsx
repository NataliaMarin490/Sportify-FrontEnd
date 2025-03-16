import { useState, useEffect } from "react";
import "../Styles/calendarDetail.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarWithTime = ({ onDateTimeChange }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("07:00");

  // Estados para manejar la carga y los errores
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reservedDates, setReservedDates] = useState([]);

  // Función simulada de obtención de datos desde el backend
  const fetchReservedDates = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      // Simulando una llamada al backend con un pequeño retraso
      setTimeout(() => {
        // Aquí va la lógica real de obtener los datos (por ejemplo, usando fetch o axios)
        // Vamos a simular un error:
        // throw new Error('No se pudo obtener la información de las fechas.');

        setReservedDates([
          { date: "2025-03-16", time: "9:00" },
          { date: "2025-03-17", time: "10:00" },
          { date: "2025-03-17", time: "15:00" },
          { date: "2025-03-18", time: "14:00" },
        ]);
        setIsLoading(false);
      }, 2000); // Simulando un retraso en la obtención de datos
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      console.error("Error al obtener las fechas reservadas:", error);
    }
  };

  // Llamamos a la función fetchReservedDates cuando se monta el componente
  useEffect(() => {
    fetchReservedDates();
  }, []);

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 7; i <= 22; i++) {
      const hour = i < 10 ? `0${i}` : i;
      times.push(`${hour}:00`);
    }
    return times;
  };

  // Obtener la hora y minutos actuales
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  /// Verificar si la fecha seleccionada es el día actual
  const isToday = (date) => {
    const today = new Date();
    return (
      date.toISOString().split("T")[0] === today.toISOString().split("T")[0]
    );
  };

  // Filtrar horas pasadas solo si es el día actual
  const filteredTimeOptions = generateTimeOptions().filter((t) => {
    const [hour, minute] = t.split(":");

    // Solo deshabilitar horas pasadas para el día actual
    if (isToday(date)) {
      if (parseInt(hour) < currentHour) {
        return false; // Deshabilitar todas las horas anteriores
      }
      if (parseInt(hour) === currentHour && currentMinutes > 0) {
        return false; // Deshabilitar la hora actual si ya pasó el minuto
      }
    }

    return true; // Mantener las horas futuras
  });

  // Función para verificar si una fecha está reservada
  const isDateReserved = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
    return reservedDates.some((reserved) => reserved.date === formattedDate);
  };

  // Función para verificar si una hora está reservada
  const isTimeReserved = (selectedTime) => {
    const formattedDate = date.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
    return reservedDates.some(
      (reserved) =>
        reserved.date === formattedDate && reserved.time === selectedTime
    );
  };

  // Función para contar cuántas horas están reservadas en un día específico
  const getReservedHoursCount = (formattedDate) => {
    return reservedDates.filter((reserved) => reserved.date === formattedDate)
      .length;
  };

  // Función para verificar si la fecha está completamente reservada (todas las horas)
  const isAllDayReserved = (formattedDate) => {
    const reservedHoursCount = getReservedHoursCount(formattedDate);
    return reservedHoursCount === generateTimeOptions().length;
  };

  // Función para obtener el estilo de la fecha
  const getDateClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
      const reservedHoursCount = getReservedHoursCount(formattedDate);
      const totalHours = generateTimeOptions().length;

      if (reservedHoursCount === totalHours) {
        return "fully-reserved-date"; // Todas las horas reservadas
      } else if (reservedHoursCount > 0) {
        return "partially-reserved-date"; // Algunas horas reservadas
      }
    }
    return "";
  };

  // Función para deshabilitar una hora si ya pasó o si está reservada
  const isHourDisabled = (selectedTime) => {
    const [selectedHour] = selectedTime.split(":").map(Number);

    // Verificar si la hora está reservada
    if (isTimeReserved(selectedTime)) {
      return true;
    }

    // Verificar si la hora ya pasó (hora en el pasado)
    if (isToday(date) && selectedHour < currentHour) {
      return true;
    }
    if (isToday(date) && selectedHour === currentHour && currentMinutes > 0) {
      return true; // Deshabilitar si la hora actual ya pasó
    }

    return false;
  };

  // Función para aplicar clase CSS para resaltar las horas reservadas
  const getTimeButtonClass = (selectedTime) => {
    if (isTimeReserved(selectedTime)) {
      return "reserved-time"; // Clase para horas reservadas
    }
    return "";
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    onDateTimeChange(selectedDate, time); // Pasar la fecha y hora seleccionada al componente principal
  };

  const handleTimeChange = (selectedTime) => {
    if (isHourDisabled(selectedTime)) {
      return; // No hacer nada si la hora está deshabilitada
    }
    setTime(selectedTime);
    onDateTimeChange(date, selectedTime); // Pasar la fecha y hora seleccionada al componente principal
  };

  // Función para reintentar obtener las fechas
  const handleRetry = () => {
    fetchReservedDates();
  };

  return (
    <div className="calendar-container">
      {isLoading ? (
        <div>Loading...</div> // Muestra un mensaje de carga
      ) : hasError ? (
        <div>
          <p>Error al obtener las fechas. Por favor, inténtelo nuevamente.</p>
          <button onClick={handleRetry}>Intentar nuevamente</button>
        </div>
      ) : (
        <>
          <h2 className="tituloCalendar">Seleccionar Fecha</h2>
          <Calendar
            onChange={handleDateChange}
            value={date}
            className="custom-calendar"
            minDate={new Date()}
            tileClassName={getDateClassName}
          />

          <h2 className="tituloCalendar">Seleccionar Hora</h2>
          <div className="time-picker">
            {filteredTimeOptions.map((t) => {
              // Verifica si la hora está reservada o ya pasó
              const disabled = isHourDisabled(t);

              return (
                <button
                  key={t}
                  className={`time-button ${
                    t === time ? "selected" : ""
                  } ${getTimeButtonClass(t)} ${disabled ? "disabled" : ""}`} // Aplica la clase 'disabled' si la hora está deshabilitada
                  onClick={() => !disabled && handleTimeChange(t)} // Solo cambia la hora si no está deshabilitada
                  disabled={disabled} // Deshabilita el botón si la hora está ocupada o ya pasó
                >
                  {t}
                </button>
              );
            })}
          </div>

          <p className="selected-info">
            📅 <strong>{date.toLocaleDateString()}</strong> - 🕒{" "}
            <strong>{time}</strong>
          </p>
        </>
      )}
    </div>
  );
};

export default CalendarWithTime;
