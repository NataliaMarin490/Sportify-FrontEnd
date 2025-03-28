import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/calendarDetail.css";
import Calendar from "react-calendar";
import API_BASE_URL from "../config";
import "react-calendar/dist/Calendar.css";
/* import BookingForm from "../components/BookingForm"; */
import { useContextGlobal } from "../Context/global.context";

const CalendarWithTime = ({ onDateTimeChange, court }) => {
  const { user } = useContextGlobal();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("07:00");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reservedSlots, setReservedSlots] = useState({});

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchReservedDates();
    }
  }, [id]);

  useEffect(() => {
    // Verificar si hay datos guardados en el localStorage
    if (user) {
    const storedDate = localStorage.getItem('selectedDate');
    const storedTime = localStorage.getItem('selectedTime');

    if (storedDate && storedTime) {
        const parsedDate = new Date(storedDate);
        setSelectedDate(parsedDate);
        setSelectedTime(storedTime);
        // Limpiar el localStorage después de usarlos
        localStorage.removeItem("selectedDate");
        localStorage.removeItem("selectedTime");
      }
    }
  }, [user]);

  // Función para obtener las fechas y horas reservadas desde la API
  const fetchReservedDates = async () => {
    try {
      setIsLoading(true);
      setHasError(false); // Resetear error antes de hacer la nueva solicitud

      const response = await fetch(
        `${API_BASE_URL}/bookings/${id}/availability`
      );
      if (!response.ok) {
        throw new Error(`Error en la API. Código: ${response.status}`);
      }

      const data = await response.json();
      //console.log("Datos recibidos:", JSON.stringify(data, null, 2));

      // Asegúrate de que reservedSlots sea un objeto
      setReservedSlots(data.reservedSlots || {});
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      console.error("Error al obtener las fechas reservadas:", error);
    }
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setSelectedTimes([]); // Limpiar selección al cambiar de fecha
    onDateTimeChange(selectedDate, []);
    // Guardar en localStorage para que persista si el usuario se desconecta
    localStorage.setItem('selectedDate', selectedDate);
    // localStorage.setItem('selectedTime', selectedTime);
  };

  const handleTimeChange = (selectedTime) => {
    setSelectedTimes((prevSelectedTimes) => {
      let updatedTimes;
      
      // Si la hora ya está seleccionada, la eliminamos
      if (prevSelectedTimes.includes(selectedTime)) {
        updatedTimes = prevSelectedTimes.filter((time) => time !== selectedTime);
      } else {
        // Si no está seleccionada, la añadimos y ordenamos
        updatedTimes = [...prevSelectedTimes, selectedTime].sort();
      }

      // Guardar en localStorage para que persista si el usuario se desconecta
      localStorage.setItem('selectedTime', updatedTimes);
  
      return updatedTimes;
    });
  };

  // Generar las opciones de hora de 07:00 a 21:00
  const generateTimeOptions = () => {
    return Array.from(
      { length: 15 }, // Genera 15 horas (de 07:00 a 21:00)
      (_, i) => `${String(i + 7).padStart(2, "0")}:00:00`
    );
  };

  // Obtener la hora y minutos actuales
  const currentDate = new Date();
  const currentFormattedTime = `${String(currentDate.getHours()).padStart(
    2,
    "0"
  )}:${String(currentDate.getMinutes()).padStart(2, "0")}:00`;

  // Verificar si la fecha seleccionada es el día actual
  const isToday = (selectedDate) => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  // Filtrar horas pasadas solo si es el día actual
  const filteredTimeOptions = generateTimeOptions().filter((t) => {
    /* const formattedTime = t; */
    // Verifica si la fecha seleccionada es hoy
    const isTodaySelected = isToday(date);
    return !(isTodaySelected && t < currentFormattedTime);
  });

  // Función para verificar si una hora está reservada
  const isTimeReserved = (selectedTime) => {
    const formattedDate = date.toISOString().split("T")[0];
    return reservedSlots[formattedDate]?.includes(`${selectedTime}:00`) ?? false;
  };

  // Función para obtener el estilo de la fecha
  const getDateClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
      const reservedHoursCount = reservedSlots[formattedDate]?.length || 0;
      const totalHours = generateTimeOptions().length;

      // Verificar si la fecha es pasada
      const today = new Date();
      const currentFormattedDate = today.toISOString().split("T")[0]; // Fecha actual en "YYYY-MM-DD"
      const formattedDateToCompare = date.toISOString().split("T")[0]; // Fecha de la celda

      if (formattedDateToCompare < currentFormattedDate) {
        return "react-calendar__tile--disabled"; // Deshabilitar las fechas pasadas
      }
      // Si es el día actual, se marca de forma especial
      if (isToday(date)) {
        return "react-calendar__tile--today"; // Marca el día actual
      }

      if (reservedHoursCount === totalHours) {
        return "react-calendar__tile--reserved"; // Todas las horas reservadas
      } else if (reservedHoursCount > 0) {
        return "react-calendar__tile--partially-reserved"; // Algunas horas reservadas
      } else {
        return "react-calendar__tile--available"; // Fechas disponibles
      }
    }
    return "";
  };

  // Función para deshabilitar una hora si está reservada
  const isHourDisabled = (selectedTime) => {
    const formattedDate = date.toISOString().split("T")[0];
    return reservedSlots[formattedDate]?.includes(selectedTime) ?? false;
  };

  // Función para verificar si una fecha es pasada
  const isDateDisabled = (date) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return date < currentDate; // Si la fecha es anterior a hoy, deshabilitada
  };
  
  
  // Mostrar un rango de horas si se seleccionan varias
  const formatSelectedTime = () => {
    if (selectedTimes.length === 0) return "No disponible";
    if (selectedTimes.length === 1) return selectedTimes[0];
    
    // Mostrar el primer y último tiempo como un rango
    return `${selectedTimes[0]} - ${selectedTimes[selectedTimes.length - 1]}`;
  };
  

  // función para guardar datos seleccionados antes del login
  const handleReservaClick = () => {
    if (!user) {
      // Guardar fecha y hora seleccionadas en el localStorage
      localStorage.setItem('selectedDate', selectedDate);
      localStorage.setItem('selectedTime', selectedTime);
      // Redirigir al login
     navigate('/login');
    } else {
      // Proceder con la reserva
      makeReserva();
    }
  };


  const handleRetry = () => {
    fetchReservedDates(); // Llama nuevamente a la función para intentar obtener los datos
  };

  return (
    <div className="calendar-container">
      {isLoading ? (
        <div>Loading...</div>
      ) : hasError ? (
        <div>
          <p>Error al obtener las fechas. Por favor, inténtelo nuevamente.</p>
          <button onClick={handleRetry}>🔄 Reintentar</button>
        </div>
      ) : (
        <>
          <h2 className="tituloCalendar">Seleccionar Fecha</h2>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate || date}
            className="custom-calendar"
            minDate={new Date()} // Esto se asegura de que no se seleccionen fechas pasadas
            tileClassName={getDateClassName}
            tileDisabled={({ date }) => isDateDisabled(date)} 
            /*selectedDate={selectedDate}
            selectedTime={selectedTime}
            
            setSelectedDate={setSelectedDate}
            setSelectedTime={setSelectedTime} */
          />

          <h2 className="tituloCalendar">Seleccionar Hora</h2>
          <div className="time-picker">
            {filteredTimeOptions.map((t) => {
              const disabled = isHourDisabled(t);
              const selected = selectedTimes.includes(t) || t === selectedTime;
              return (
                <button
                  key={t}
                  className={`time-button ${selected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                  onClick={() => !disabled && handleTimeChange(t)}
                  disabled={disabled}
                >
                  {t.slice(0, 5)} {/* Muestra la hora sin los segundos */}
                </button>
              );
            })}
          </div>

          <p className="selected-info">
            📅 <strong>{date.toLocaleDateString()}</strong> - 🕒<strong>{formatSelectedTime()}</strong>
          </p>

          {/* {user && selectedTimes.length > 0 && court && (
            <BookingForm
              user={user}
              selectedCourt={id}
              selectedDate={date}
              selectedTime={selectedTimes}
              pricePerHour={court?.pricePerHour || 0}
            />
          )} */}

        </>
      )}
    </div>
  );
};

export default CalendarWithTime;
