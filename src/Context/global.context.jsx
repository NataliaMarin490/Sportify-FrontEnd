import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { reducer } from "../reducers/reducer";

const DEFAULT_IMAGE =
  "https://civideportes.com.co/wp-content/uploads/2019/10/C%C3%B3mo-hacer-una-cancha-de-f%C3%BAtbol.jpg";

const ContextGlobal = createContext();

const initialState = {
  courts: [],
  recommendedCourts: [],
  toggleSidebar: false,
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleSidebar = useCallback((show) => {
    dispatch({ type: "TOGGLE_SIDEBAR", payload: show });
  }, [dispatch]);


  function transformImageUrls(imageUrls) {
    const defaultImage = DEFAULT_IMAGE;

    if (Array.isArray(imageUrls)) {
      return imageUrls.map((url) => {
        if (!url) return defaultImage;
        const id = url.split("id=")[1]; // Extrae el ID de la URL
        return id
          ? `https://lh3.googleusercontent.com/d/${id}=w500`
          : defaultImage;
      });
    } else if (typeof imageUrls === "string") {
      if (!imageUrls) return defaultImage;
      const id = imageUrls.split("id=")[1];
      return id
        ? `https://lh3.googleusercontent.com/d/${id}=w500`
        : defaultImage;
    }

    return defaultImage;
  }

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/courts/search"
        );

        const modifiedData = response.data.map((court) => ({
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
        const response = await axios.get(
          "http://localhost:8080/api/courts/random"
        );

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
