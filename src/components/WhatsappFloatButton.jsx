import React, { useState } from "react";
import "../Styles/whatsappFloatButton.css"; // Asegúrate de crear el archivo CSS

const WhatsAppFloatButton = () => {
  // Estado para manejar la visibilidad del chat y el mensaje del usuario
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  // Función para abrir el chat simulado
  const openWhatsAppChat = () => {
    setShowChat(true); // Mostrar el chat cuando el usuario hace clic
  };

  // Función para cerrar el chat simulado
  const closeChat = () => {
    setShowChat(false); // Cerrar el chat
  };

  // Función para enviar un mensaje predefinido o el mensaje del usuario
  const sendMessage = (message) => {
    if (message.trim() !== "") {
      alert(`Mensaje enviado: ${message}`);
      setUserMessage(""); // Limpiar el campo de entrada después de enviar el mensaje
    } else {
      alert("Por favor, escribe un mensaje.");
    }
  };

  return (
    <div>
      <div id="whatsapp-float" onClick={openWhatsAppChat}>
        <i className="fab fa-whatsapp"></i>
      </div>

      {showChat && (
        <div id="whatsapp-chat-modal">
          <div className="chat-header">
            <div className="header-left">
              <img
                src="\public\images\home\bot.jpg" // Aquí puedes usar una imagen de un robot
                alt="Sporty-Bot"
                className="robot-icon"
              />
              <h2>Sporty-Bot</h2>
            </div>
            <button onClick={closeChat}>X</button>
          </div>
          <div className="chat-body">
            <p>¡Hola! ¿En qué puedo ayudarte?</p>
            <div className="chat-options">
              <button
                onClick={() => sendMessage("¿Me puedes dar más información?")}
              >
                Más información
              </button>
              <button onClick={() => sendMessage("Quiero hacer una reserva")}>
                Reservar
              </button>
              <button
                onClick={() => {
                  const phoneNumber = "59894630330"; // Reemplaza con el número de WhatsApp del agente (con código de país)
                  const message = encodeURIComponent("Hola, necesito hablar con un agente sobre Sportify.");
                  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
                }}
              >
                Hablar con un agente
              </button>

            </div>
            <div className="user-message">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
              />
              <button onClick={() => sendMessage(userMessage)}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppFloatButton;
