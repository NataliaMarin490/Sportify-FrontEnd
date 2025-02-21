import "../Styles/recommendations.css";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Recommendations = ({ courts }) => {
  Recommendations.propTypes = {
    courts: PropTypes.array.isRequired,
  };

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
        {courts.map((court, index) => (
          <Link key={index} to={`/detail/${court.id}`}>
            <img
              className="recommendations-fields"
              src={court.image}
              alt={court.title}
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default Recommendations;
