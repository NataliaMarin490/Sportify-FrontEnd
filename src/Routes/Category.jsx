import Image from "../components/Image";
import "../Styles/Category.css";
import { useRecipeStates } from "../Context/Context";
import CardsCategory from "../components/CardsCategory";

const Category = () => {
  const { state } = useRecipeStates();

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
        {state.recipes.map((recipe) => (
          <CardsCategory key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Category;
