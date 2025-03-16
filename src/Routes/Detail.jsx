import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import Map from "../components/Map";
import "../Styles/detail.css";
import ImageGallery from "../components/ImageGallery";
import BackButton from "../components/BackButton";
import { useContextGlobal } from "../Context/global.context";
import Calendar from "../components/CalendarDetail.jsx";

const Detail = () => {
  const { state } = useContextGlobal();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("7:00");

  const handleDateTimeChange = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product =
    state?.courts?.data && Array.isArray(state?.courts?.data)
      ? state?.courts?.data?.find((item) => item.id === parseInt(id))
      : null;

  return (
    <>
      <div className="detail-container">
        <BackButton />
        <div className="detail">
          <div className="product">
            <div className="gallery">
              <img
                className="image-detail"
                src={product.imageUrl[id - 1]}
                alt={product.name}
              />
              <ImageGallery />
            </div>
          </div>
          <div className="product-info">
            <div className="description-container">
              <div className="detail-product-container">
                <div className="detail-header">
                  <h4 className="title-product"> {product.name} </h4>
                  <span>4.5 Stars | 450 Reseñas</span>
                </div>
                <div className="detail-content">
                  <span>{product.pricePerHour}</span>
                  <span>{product.city}</span>
                  <span>{product.sport}</span>
                  <span>{product.status}</span>
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
              <div>Reseñas y puntuación</div>
            </div>
            <Calendar onDateTimeChange={handleDateTimeChange} />
            <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
          </div>
        </div>
        <div className="map">
          <h4 className="title-product"> Ubicación </h4>
          <Map />
        </div>
      </div>
    </>
  );
};

export default Detail;
