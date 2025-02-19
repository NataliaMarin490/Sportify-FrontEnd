import Image from "../components/Image";
import "../Styles/Category.css";
import { useContextGlobal} from "../Context/global.context";
import CardsCategory from "../components/CardsCategory";

const Category = () => {
  const { state } = useContextGlobal;

  return (
    <div className="category-container">
      <Image />
      <div className="searcherCat">
        <input name="address" type="text" placeholder="Dirección" />
        <input name="sport" type="text" placeholder="Deporte" />
        <input name="day" type="text" placeholder="Fecha" />
        <input name="hour" type="number" placeholder="Hora" />
        <button>Buscar</button>
      </div>
      <div className="category-cards-container">
        {state.courts.map((court) => (
          <CardsCategory key={court.id} recipe={court} />
        ))}
      </div>
    </div>
  );
};

export default Category;
