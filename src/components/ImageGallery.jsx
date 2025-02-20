import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Styles/imageGallery.css";

const courts = [
  {
    id: 1,
    name: "Estadio La Cancha 1",
    sport: "Fútbol",
    city: "Bogotá",
    status: "Activo",
    description: "Estadio La Cancha 1",
    capacity: 11,
    pricePerHour: 50000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 2,
    name: "Estadio La Cancha 2",
    sport: "Fútbol",
    city: "Bogotá",
    status: "Activo",
    description: "Estadio La Cancha 2",
    capacity: 11,
    pricePerHour: 50000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 3,
    name: "Estadio La Cancha 3",
    sport: "Fútbol",
    city: "Bogotá",
    status: "Activo",
    description: "Estadio La Cancha 3",
    capacity: 11,
    pricePerHour: 50000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 4,
    name: "Estadio La Cancha 4",
    sport: "Fútbol",
    city: "Bogotá",
    status: "Activo",
    description: "Estadio La Cancha 4",
    capacity: 11,
    pricePerHour: 50000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 5,
    name: "Cancha Central de Basket 1",
    sport: "Baloncesto",
    city: "Bogotá",
    status: "Activo",
    description: "Cancha Central de Basket 1",
    capacity: 11,
    pricePerHour: 60000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 6,
    name: "Cancha Central de Basket 2",
    sport: "Baloncesto",
    city: "Bogotá",
    status: "Activo",
    description: "Cancha Central de Basket 2",
    capacity: 11,
    pricePerHour: 60000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 7,
    name: "Cancha Central de Basket 3",
    sport: "Baloncesto",
    city: "Bogotá",
    status: "Activo",
    description: "Cancha Central de Basket 3",
    capacity: 11,
    pricePerHour: 60000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 8,
    name: "Cancha Central de Basket 4",
    sport: "Baloncesto",
    city: "Bogotá",
    status: "Activo",
    description: "Cancha Central de Basket 4",
    capacity: 11,
    pricePerHour: 60000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: ["../../public/icons/image 7.png", "../../public/icons/image 7.png"],
  },
  {
    id: 9,
    name: "Cancha Central de Tenis 1",
    sport: "Tenis",
    city: "Bogotá",
    status: "Activo",
    description: "Cancha Central de Tenis 1",
    capacity: 11,
    pricePerHour: 80000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: [
      "../../public/icons/image 7.png",
      "../../public/icons/image 7.png",
      "../../public/icons/image 7.png",
      "../../public/icons/image 7.png",
    ],
  },
  {
    id: 10,
    name: "Cancha Central de Tenis 2",
    sport: "Tenis",
    city: "Bogotá",
    status: "Activo",
    description: "Cancha Central de Tenis 2",
    capacity: 11,
    pricePerHour: 80000,
    address: "Calle 68",
    neighborhood: "Salitre",
    image: [
      "../../public/icons/image 7.png",
      "../../public/icons/image 7.png",
      "../../public/icons/image 7.png",
      "../../public/icons/image 7.png",
    ],
  },
];

const ImageGallery = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Buscar la cancha por ID
    const selectedCourt = courts.find((court) => court.id === Number(id));

    if (selectedCourt) {
      setImages(
        Array.isArray(selectedCourt.image)
          ? selectedCourt.image
          : [selectedCourt.image]
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
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Imágenes de la Cancha</h3>
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
