import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import Map from "../components/Map";
import "../Styles/detail.css";
import ImageGallery from "../components/ImageGallery";
import BackButton from "../components/BackButton";
import { useContextGlobal } from "../Context/global.context";
import Calendar from "../components/CalendarDetail.jsx";
import { Share2 } from "lucide-react";
import ShareCourtModal from "../components/ShareCourtModal.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import axios from "axios";
import API_BASE_URL from "../config.js";
import Reviews from "../components/Reviews.jsx";
import WhatsAppFloatButton from "../components/WhatsappFloatButton.jsx";

const Detail = () => {
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    sport: "",
    city: "",
    status: "",
    description: "",
    capacity: 0,
    pricePerHour: 0,
    address: "",
    neighborhood: "",
    imageUrl: [], // Inicializado como un array vacío
    features: [],
    featuresImageUrl: [],
  });
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { id } = useParams();
  const currentUrl = window.location.href;
  const [reviews, setReviews] = useState([]); // Estado para almacenar las reseñas
  const [ratings, setRatings] = useState({}); // Estado para almacenar las calificaciones
  const [comments, setComments] = useState({}); // Estado para almacenar los comentarios
  const [dates, setDates] = useState({}); // Estado para almacenar las fechas de las reseñas

  const handleDateTimeChange = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const url = `${API_BASE_URL}/public/courts/search/${id}`;

  useEffect(() => {
    axios(url)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [url]);

  useEffect(() => {
    // Recuperar las calificaciones, comentarios y fechas desde localStorage
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || {};

    // Filtrar las reseñas basadas en el `id` de la cancha actual
    if (storedReviews && storedReviews[id]) {
      const currentCourtReviews = Object.keys(storedReviews[id]).map(
        (bookingId) => ({
          courtId: id,
          idBooking: bookingId,
          ...storedReviews[id][bookingId],
        })
      );

      // Establecer las reseñas en el estado
      setReviews(currentCourtReviews);
    } else {
      setReviews([]);
    }
  }, [id]);

  if (error || !product) {
    return (
      <div className="not-found-container">
        <BackButton />
        <div className="not-found-message">
          <h2>Producto no encontrado</h2>
          <p>
            Lo sentimos, el producto que está buscando no existe o ha sido
            eliminado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="detail-container">
        <BackButton />
        <div className="detail">
          <div className="detail-buttons">
            <FavoriteButton product={product} />
            <button
              className="court-button"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 size={25} />
            </button>
          </div>
          <div className="product">
            <div className="gallery">
              <img
                className="image-detail"
                src={
                  product.imageUrl?.[product.imageUrl.length - 4] ||
                  "default-image-url"
                }
                alt={product.name || "Court image"}
              />
              <ImageGallery images={product.imageUrl || []} />
            </div>
          </div>
          <div className="product-info">
            <div className="description-container">
              <div className="detail-product-container">
                <div className="detail-header">
                  <h4 className="title-product"> {product.name} </h4>
                  <div className="rating1">
                    <div className="rating-prom">
                      <span className="fa fa-star checked"></span>
                      <span>
                        {reviews.length > 0 ? (
                          // Calculamos el rating promedio
                          <p>
                            {(
                              reviews.reduce(
                                (sum, review) => sum + review.rating,
                                0
                              ) / reviews.length
                            ).toFixed(1)}{" "}
                          </p>
                        ) : (
                          <p>No hay reseñas para esta cancha.</p>
                        )}
                      </span>
                    </div>
                    <span>| # Reseñas: {reviews.length} </span>
                  </div>
                </div>
                <div className="detail-content">
                  <span>
                    <strong>Precio: </strong>
                    {product.pricePerHour}
                  </span>
                  <span>
                    <strong>Ciudad: </strong>
                    {product.city}
                  </span>
                  <span>
                    <strong>Deporte: </strong>
                    {product.sport}
                  </span>
                  <span>
                    <strong>Estado: </strong>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="detail-product-container">
                <div className="detail-header">
                  <h4 className="title-product"> Características </h4>
                </div>
                <div className="detail-content">
                  {product.features &&
                    product.features.map((feature, index) => (
                      <div key={index} className={`feature-item`}>
                        {product.featuresImageUrl[index] && (
                          <img
                            src={product.featuresImageUrl[index]}
                            alt={feature}
                            className="feature-icon"
                          />
                        )}
                        <span>{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="detail-product-container">
                <div className="detail-header">
                  <h4 className="title-product"> Políticas </h4>
                </div>
                <div className="policies-content">
                  <div className="policy-column">
                    <h5>Normas de la cancha</h5>
                    <p>
                      No se permite el ingreso con alimentos o bebidas. Uso
                      obligatorio de calzado deportivo adecuado. Respetar el
                      horario de reserva asignado.
                    </p>
                  </div>
                  <div className="policy-column">
                    <h5>Política de cancelación</h5>
                    <p>
                      Cancelación gratuita hasta 24 horas antes. 50% de
                      reembolso hasta 12 horas antes. Sin reembolso en
                      cancelaciones posteriores.
                    </p>
                  </div>
                  <div className="policy-column">
                    <h5>Información adicional</h5>
                    <p>
                      Presentarse 15 minutos antes de la reserva. Documento de
                      identidad requerido. Se debe realizar el pago completo por
                      adelantado.
                    </p>
                  </div>
                </div>
              </div>
              <div className="reviews-main-container">
                {/* Mostramos las reseñas aquí */}
                <Reviews reviews={reviews} />
              </div>
            </div>
            <div className="container-booking-calendar">
              <Calendar onDateTimeChange={handleDateTimeChange} />
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                pricePerHour={product.pricePerHour}
                productInfo={product}
              />
            </div>
          </div>
        </div>
        <div className="map">
          <h4 className="title-product"> Ubicación </h4>
          <Map />
        </div>
      </div>
      <ShareCourtModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
        currentUrl={currentUrl}
      />
      <WhatsAppFloatButton />
    </>
  );
};

export default Detail;
