import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useContextGlobal } from "../Context/global.context";
import "../Styles/imageGallery.css";

const ImageGallery = () => {
  const { state } = useContextGlobal();
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const selectedCourt = state?.courts?.data?.find((court) => court.id === Number(id));

    if (selectedCourt) {
      setImages(
        selectedCourt.imageUrl.map((img) =>
          typeof img === "string" ? img : img.url
        )
      );
    } else {
      setImages([]);
    }
  }, [id]);

  return (
    <div className="gallery-container">
      <div className="image-grid">
        {images.slice(0, 4).map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Imagen ${index + 1}`}
            className="gallery-image"
          />
        ))}
      </div>
      <button className="view-more-btn" onClick={() => setIsModalOpen(true)}>
        Ver Más
      </button>

      {/* MODAL */}
      {isModalOpen && (

        <div
          className={`modal-overlay ${isModalOpen ? "show" : ""}`}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-images">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Imagen ${index + 1}`}
                  className="modal-image"
                />
              ))}
            </div>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
