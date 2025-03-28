import { useState, useEffect } from "react";
import {
  X,
  Facebook,
  Twitter,
  Link2,
  MessageCircle,
} from "lucide-react";
import "../Styles/shareCourtModal.css";

const ShareCourtModal = ({ isOpen, onClose, product, currentUrl }) => {
  const [customMessage, setCustomMessage] = useState(
    `Mira esta increíble cancha: ${product.name} disponible para reservar en ${currentUrl}`
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const shareContent = {
    title: product?.name,
    description: product?.description,
    image: product?.imageUrl[product.id - 1],
    url: currentUrl,
  };

  const handleShare = (platform) => {
    const message = encodeURIComponent(customMessage);
    const url = encodeURIComponent(currentUrl);
    const appId = "1150599023381576";

    const shareUrls = {
      facebook: `https://www.facebook.com/dialog/share?app_id=${appId}&href=${url}&quote=${message}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}&url=${url}`,
      whatsapp: `https://api.whatsapp.com/send?text=${message}%20${url}`,
    };

    window.open(shareUrls[platform], "_blank", "width=1000,height=700");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    alert("Enlace copiado al portapapeles!");
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        <h3>Comparte esta cancha</h3>

        <div className="share-preview">
          <img src={shareContent.image} alt={shareContent.title} />
          <h4>{shareContent.title}</h4>
          <p>{shareContent.description}</p>
        </div>

        <div className="custom-message">
          <textarea
            placeholder={customMessage || "Escribe tu mensaje personalizado"}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
        </div>

        <div className="share-buttons">
          <button onClick={() => handleShare("twitter")}>
            <Twitter /> Twitter
          </button>
          <button onClick={() => handleShare("whatsapp")}>
            <MessageCircle /> WhatsApp
          </button>
          <button onClick={() => handleShare("facebook")}>
            <Facebook /> Facebook
          </button>          
          <button onClick={handleCopyLink}>
            <Link2 /> Copiar enlace
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCourtModal;
