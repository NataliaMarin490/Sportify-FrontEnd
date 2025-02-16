import "../Styles/reco.css";
import { Link } from "react-router-dom";

import "../Styles/cards.css";

const Reco = ({ recipe }) => {
  const { title, image, id } = recipe;
  console.log(recipe);

  return (
    <div className="ContenedorReco">
      <Link to={`/detail/${id}`}>
        <img className="canchasReco" src={image} alt={title} />
      </Link>
    </div>
  );
};

export default Reco;
