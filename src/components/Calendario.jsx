import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Styles/calendario.css";

const Calendario = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <div>
      <h3>Selecciona fecha y hora:</h3>
      <div className="date-time-picker">
        {/* Selector de fecha y hora en el mismo contenedor */}
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="datepicker"
          placeholderText=""
          open={true}
        />

        <DatePicker
          selected={selectedTime}
          onChange={(time) => setSelectedTime(time)}
          showTimeSelect
          showTimeSelectOnly
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="HH:mm"
          className="datepicker timepicker"
          placeholderText=""
          open={true}
        />
      </div>

      {/* Mostrar la fecha y hora seleccionadas */}
      {selectedDate && selectedTime && (
        <p>
          Fecha seleccionada: {selectedDate.toLocaleDateString()} - Hora
          seleccionada: {selectedTime.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default Calendario;
