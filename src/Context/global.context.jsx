import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { reducer } from "../reducers/reducer";
import API_BASE_URL from "../config";
import { courts } from "./courts";

const DEFAULT_IMAGE = "https://i.imgur.com/WYy9SAr.jpeg"; // Nueva imagen por defecto de Imgur

const ContextGlobal = createContext();

const initialState = {
  courts: [],
  recommendedCourts: [],
  toggleSidebar: false,
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleSidebar = useCallback(
    (show) => {
      dispatch({ type: "TOGGLE_SIDEBAR", payload: show });
    },
    [dispatch]
  );

  function transformImageUrls(imageUrls) {
    if (!imageUrls) return DEFAULT_IMAGE;

    if (Array.isArray(imageUrls)) {
      return imageUrls.map((url) => (url ? url : DEFAULT_IMAGE));
    }

    return typeof imageUrls === "string" ? imageUrls : DEFAULT_IMAGE;
  }

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/courts/search?page=1&size=10`
        );

        const modifiedData = response.data.data.map((court) => ({
          ...court,
          imageUrl: transformImageUrls(court.imageUrl),
        }));
        dispatch({ type: "GET_COURTS", payload: modifiedData });
      } catch (error) {
        console.error("Error al obtener las canchas:", error);
      }
    };

    const fetchRecommendedCourts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/courts/random`);

        const modifiedData = response.data.map((court) => ({
          ...court,
          imageUrl: transformImageUrls(court.imageUrl),
        }));

        dispatch({ type: "GET_RECOMMENDED_COURTS", payload: modifiedData });
      } catch (error) {
        console.error("Error al obtener las recomendaciones:", error);
      }
    };

    fetchCourts();
    fetchRecommendedCourts();
  }, []);

  return (
    <ContextGlobal.Provider value={{ state, dispatch, toggleSidebar }}>
      {children}
    </ContextGlobal.Provider>
  );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);
