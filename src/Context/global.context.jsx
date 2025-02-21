import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "../reducers/reducer";
import { courts } from "./courts";

const DEFAULT_IMAGE =
  "https://civideportes.com.co/wp-content/uploads/2019/10/C%C3%B3mo-hacer-una-cancha-de-f%C3%BAtbol.jpg";

const ContextGlobal = createContext();

const initialState = {
  courts: [],
  recommendedCourts: [],
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //const [cart, setCart] = useState([]);
  //const [courts, setcourts] = useState([]);

  // const url = `http://localhost:8080/api/courts/search`;

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

    // Función que extrae el id del parámetro "id" en la URL de Google Drive
    function getIdFromUrl(url) {
      if (typeof url !== "string") return null;
      const match = url.match(/[?&]id=([^&]+)/);
      return match ? match[1] : null;
    }

    // Función para transformar imageUrl, ya sea que venga como string o array
    function transformImageUrls(imageUrls) {
      // Define aquí tu imagen por defecto
      const defaultImage = DEFAULT_IMAGE;

      if (Array.isArray(imageUrls)) {
        return imageUrls.map((url) => {
          // Si el elemento es null, undefined o una cadena vacía, retorna la imagen por defecto
          if (!url) return defaultImage;
          const id = getIdFromUrl(url);
          // Si se extrajo el id, se crea la nueva URL, sino se asigna la imagen por defecto
          return id ? `https://lh3.google.com/u/0/d/${id}` : defaultImage;
        });
      } else if (typeof imageUrls === "string") {
        if (!imageUrls) return defaultImage;
        const id = getIdFromUrl(imageUrls);
        return id ? `https://lh3.google.com/u/0/d/${id}` : defaultImage;
      }
      // En otros casos, se retorna la imagen por defecto
      return defaultImage;
    }

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
    <ContextGlobal.Provider value={{ state, dispatch }}>
      {children}
    </ContextGlobal.Provider>
  );
};

export default ContextProvider;

export const useContextGlobal = () => useContext(ContextGlobal);
