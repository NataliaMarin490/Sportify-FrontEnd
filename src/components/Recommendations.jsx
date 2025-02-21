import "../Styles/recommendations.css";
import { Link } from "react-router-dom";

const Recommendations = ({ recipe }) => {
  const { title, image, id } = recipe;

  return (
    <div className="recommendations-container">
      <Link to={`/detail/${id}`}>
        <img className="recommendations-fields" src={image} alt={title} />
      </Link>
    </div>
  );
};

export default Recommendations;
