import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "../reducers/reducer";

const RecipeStates = createContext();

const initialState = {
  cart: [],
  recipes: [],
};

const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //const [cart, setCart] = useState([]);
  //const [recipes, setRecipes] = useState([]);

  const url = `https://api.spoonacular.com/recipes/random?number=10&apiKey=85e5e4352f844d13ae580009b2dee4f5`;

  useEffect(() => {
    axios(url).then((res) => {
      console.log(res.data.recipes);
      dispatch({ type: "GET_RECIPES", payload: res.data.recipes });
      //setRecipes(res.data.recipes);
    });
  }, []);

  return (
    <RecipeStates.Provider value={{ state, dispatch }}>
      {children}
    </RecipeStates.Provider>
  );
};

export default Context;

export const useRecipeStates = () => useContext(RecipeStates);
