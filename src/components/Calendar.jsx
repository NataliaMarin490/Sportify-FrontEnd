import { useState } from "react";
import "../Styles/calendar.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalendarWithTime = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("07:00");

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 7; i <= 22; i++) {
      const hour = i < 10 ? `0${i}` : i;
      times.push(`${hour}:00`);
    }
    return times;
  };

  return (
    <div className="calendar-container">
      <h2 className="tituloCalendar">Seleccionar Fecha</h2>
      <Calendar onChange={setDate} value={date} className="custom-calendar" />

      <h2 className="tituloCalendar">Seleccionar Hora</h2>
      <div className="time-picker">
        {generateTimeOptions().map((t) => (
          <button
            key={t}
            className={`time-button ${t === time ? "selected" : ""}`}
            onClick={() => setTime(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="selected-info">
        📅 <strong>{date.toLocaleDateString()}</strong> - 🕒{" "}
        <strong>{time}</strong>
      </p>
    </div>
  );
};

export default CalendarWithTime;
