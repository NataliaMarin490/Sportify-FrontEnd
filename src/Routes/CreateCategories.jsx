import React, { useState } from "react";
import {
  FaFutbol,
  FaBasketballBall,
  FaTableTennis,
  FaBaseballBall,
  FaVolleyballBall,
  FaRunning,
  FaBiking,
  FaGolfBall,
  FaSkiing,
  FaSwimmer,
  FaDumbbell,
  FaBowlingBall,
  FaTableTennis as FaPingPong,
  FaHiking,
  FaChess,
  FaFootballBall,
  FaHandHoldingWater,
  FaSkating,
  FaSnowboarding,
} from "react-icons/fa";
import "../Styles/addCategory.css";

const sportsIcons = [
  { name: "Fútbol", icon: <FaFutbol size={30} />, iconName: "fa-futbol" },
  {
    name: "Baloncesto",
    icon: <FaBasketballBall size={30} />,
    iconName: "fa-basketball-ball",
  },
  {
    name: "Tenis",
    icon: <FaTableTennis size={30} />,
    iconName: "fa-table-tennis",
  },
  {
    name: "Béisbol",
    icon: <FaBaseballBall size={30} />,
    iconName: "fa-baseball-ball",
  },
  {
    name: "Voleibol",
    icon: <FaVolleyballBall size={30} />,
    iconName: "fa-volleyball-ball",
  },
  { name: "Atletismo", icon: <FaRunning size={30} />, iconName: "fa-running" },
  { name: "Ciclismo", icon: <FaBiking size={30} />, iconName: "fa-bicycle" },
  { name: "Golf", icon: <FaGolfBall size={30} />, iconName: "fa-golf-ball" },
  { name: "Esquí", icon: <FaSkiing size={30} />, iconName: "fa-skiing" },
  { name: "Natación", icon: <FaSwimmer size={30} />, iconName: "fa-swimmer" },
  { name: "Gimnasio", icon: <FaDumbbell size={30} />, iconName: "fa-dumbbell" },
  {
    name: "Boliche",
    icon: <FaBowlingBall size={30} />,
    iconName: "fa-bowling-ball",
  },
  {
    name: "Ping Pong",
    icon: <FaPingPong size={30} />,
    iconName: "fa-table-tennis",
  },
  { name: "Senderismo", icon: <FaHiking size={30} />, iconName: "fa-hiking" },
  { name: "Ajedrez", icon: <FaChess size={30} />, iconName: "fa-chess" },
  {
    name: "Fútbol Americano",
    icon: <FaFootballBall size={30} />,
    iconName: "fa-football-ball",
  },
  {
    name: "Remo",
    icon: <FaHandHoldingWater size={30} />,
    iconName: "fa-hand-holding-water",
  },
  { name: "Patinaje", icon: <FaSkating size={30} />, iconName: "fa-skating" },
  {
    name: "Snowboarding",
    icon: <FaSnowboarding size={30} />,
    iconName: "fa-snowboarding",
  },
];

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !selectedIcon) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    setIsLoading(true);

    const formData = {
      name,
      description,
      icon: selectedIcon.iconName,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/public/sports/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Error al guardar el deporte");

      alert("Deporte creado con éxito!");
      setName("");
      setDescription("");
      setSelectedIcon(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-category-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Crear Deporte</h1>
        <label>
          Nombre del Deporte:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="6"
          />
        </label>

        <label>
          Icono:
          <div className="icon-select-container">
            {sportsIcons.map((sport, index) => (
              <div
                key={index}
                className={`icon-option ${
                  selectedIcon?.name === sport.name ? "selected" : ""
                }`}
                onClick={() => setSelectedIcon(sport)}
              >
                {sport.icon}
              </div>
            ))}
          </div>
        </label>

        <div className="button-container">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
