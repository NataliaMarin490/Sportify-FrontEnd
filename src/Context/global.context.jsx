import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "../reducers/reducer";

const ContextGlobal = createContext();

const initialState = {
  courts: [],
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //const [cart, setCart] = useState([]);
  //const [courts, setcourts] = useState([]);

  //const url = `https://api.spoonacular.com/courts/random?number=10&apiKey=85e5e4352f844d13ae580009b2dee4f5`;
  const url = `http://localhost:8080/api/courts/search`;

  useEffect(() => {
    axios(url).then((res) => {
      console.log(res.data);
      dispatch({ type: "GET_COURTS", payload: res.data});
      //dispatch({ type: "GET_courts", payload: res.data.courts });
      //setcourts(res.data.courts);
    });
  }, []);
 
  return (
    <ContextGlobal.Provider value={{ state, dispatch }}>
      {children}
    </ContextGlobal.Provider>
  );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);
