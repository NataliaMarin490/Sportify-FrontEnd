import "../Styles/recommendations.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContextGlobal } from "../Context/global.context";


const Recommendations = ({ courts }) => {
  const { state } = useContextGlobal();

  // Si no se pasa 'courts' como prop, usa 'recommendedCourts' del contexto
  const courtsToDisplay = courts || state.recommendedCourts || [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
  };

  return (
    <div className="recommendations-container">
      <Slider {...settings}>
        {courtsToDisplay.map((court, index) => (
          <Link key={index} to={`/detail/${court.id}`}>
            <img
              className="recommendations-fields"
              src={court.imageUrl[0]}
              alt={court.title}
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

Recommendations.propTypes = {
  courts: PropTypes.array,
};

export default Recommendations;
