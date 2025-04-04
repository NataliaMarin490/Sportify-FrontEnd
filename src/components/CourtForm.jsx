import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/createCourt.css";
import API_BASE_URL from "../config";

const CourtForm = ({ onSubmit, courtId, isEditing }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    country: "",
    address: "",
    capacity: "",
    description: "",
    price: "",
    city: "",
    region: "",
    neighborhood: "",
    images: [],
  });

  const { id } = useParams();
  const [sports, setSports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/sports/status/5`)
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error("Error fetching sports:", error));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/public/countries/search`)
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch(`${API_BASE_URL}/public/regions/by-country/${formData.country}`)
        .then((response) => response.json())
        .then((data) => setRegions(data))
        .catch((error) => console.error("Error fetching regions:", error));
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.region) {
      fetch(`${API_BASE_URL}/public/cities/by-region/${formData.region}`)
        .then((response) => response.json())
        .then((data) => setCities(data))
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images.filter((img) => typeof img === "string"),
          ...newFiles,
        ],
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Cargar características
  useEffect(() => {
    fetch(`${API_BASE_URL}/public/features`)
      .then((response) => response.json())
      .then((data) => {
        setFeatures(data);
      })
      .catch((error) => console.error("Error fetching features:", error));
  }, []);

  const [courtData, setCourtData] = useState(null);

  useEffect(() => {
    if (isEditing && courtId) {
      fetch(`${API_BASE_URL}/public/courts/search/${courtId}`)
        .then((res) => res.json())
        .then((data) => setCourtData(data))
        .catch((err) => console.error(err));
    }
  }, [isEditing, courtId]);

  useEffect(() => {
    const preloadData = async () => {
      if (courtData && features.length > 0) {
        const normalize = (str) =>
          str
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, " ");

        const selectedIds = features
          .filter((feature) =>
            courtData.features?.some(
              (f) => normalize(f) === normalize(feature.feature)
            )
          )
          .map((feature) => feature.idFeature);

        setSelectedFeatures(selectedIds);

        const sportMatch = sports.find(
          (s) => normalize(s.name) === normalize(courtData.sport)
        );

        // Primero cargamos regiones del país
        const countryRes = await fetch(
          `${API_BASE_URL}/public/countries/search`
        );
        const countriesData = await countryRes.json();
        const countryMatch = countriesData.find(
          (c) => normalize(c.countryName) === normalize(courtData.country)
        );
        setCountries(countriesData);

        const regionRes = await fetch(
          `${API_BASE_URL}/public/regions/by-country/${countryMatch?.idCountry}`
        );
        const regionData = await regionRes.json();
        setRegions(regionData);

        const regionMatch = regionData.find(
          (r) => normalize(r.name) === normalize(courtData.region)
        );

        const cityRes = await fetch(
          `${API_BASE_URL}/public/cities/by-region/${regionMatch?.id}`
        );
        const cityData = await cityRes.json();
        setCities(cityData);

        const cityMatch = cityData.find(
          (c) => normalize(c.name) === normalize(courtData.city)
        );

        setFormData((prev) => ({
          ...prev,
          name: courtData.name,
          description: courtData.description,
          capacity: courtData.capacity,
          price: courtData.pricePerHour,
          address: courtData.address,
          neighborhood: courtData.neighborhood,
          images: courtData.imageUrl || [],
          sport: sportMatch?.id || "",
          country: countryMatch?.idCountry || "",
          region: regionMatch?.id || "",
          city: cityMatch?.id || "",
        }));
      }
    };

    preloadData();
  }, [courtData, features, sports]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length < 5) {
      alert("Debes subir al menos 5 imágenes.");
      return;
    }

    setIsLoading(true);

    const formDataToSend = new FormData();

    const courtData = {
      name: formData.name,
      description: formData.description,
      capacity: Number(formData.capacity),
      pricePerHour: Number(formData.price),
      address: formData.address,
      neighborhood: formData.neighborhood,
      sportId: Number(formData.sport),
      cityId: Number(formData.city),
      statusId: 1,
      featureIds: selectedFeatures.map((feature) => Number(feature)), // Convertir a número
    };

    formDataToSend.append("court", JSON.stringify(courtData));

    // Agregar las imágenes al FormData
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const url = isEditing
        ? `${API_BASE_URL}/public/courts/update/${courtId}`
        : `${API_BASE_URL}/public/courts/add`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Error al guardar la cancha");
      }

      alert(
        isEditing ? "Cancha actualizada con éxito!" : "Cancha creada con éxito!"
      );
      navigate("/administracion");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const isValidFile = (file) => file instanceof File || file instanceof Blob;

  return (
    <form className="court" onSubmit={handleSubmit}>
      <h1>{isEditing ? "Editar cancha" : "Agregar cancha"}</h1>
      <h3>Datos de la cancha</h3>
      <div className="court-form">
        <div className="form-section left">
          <label>
            Nombre de la Cancha:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Precio por Hora:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Ubicación:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            País:
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un país</option>
              {countries.map((country) => (
                <option key={country.idCountry} value={country.idCountry}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ciudad:
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={!formData.region}
            >
              <option value="">Selecciona una ciudad</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-section right">
          <label>
            Deporte:
            <select
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un deporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Capacidad de Personas:
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Barrio:
            <input
              type="text"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Región/Estado:
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              disabled={!formData.country}
            >
              <option value="">Selecciona una región</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descripción:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="features-section">
          <h3>Características</h3>
          <div className="features-list">
            {features.map((feature) => (
              <label key={feature.idFeature} className="feature-item">
                <input
                  type="checkbox"
                  value={feature.idFeature}
                  checked={selectedFeatures.includes(feature.idFeature)}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setSelectedFeatures((prev) =>
                      prev.includes(value)
                        ? prev.filter((id) => id !== value)
                        : [...prev, value]
                    );
                  }}
                />
                <img
                  src={feature.imageUrl}
                  alt={feature.feature}
                  width="40"
                  height="40"
                />
                <span>{feature.feature}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="image-section">
          <label>Seleccionar imagen</label>
          <label className="image-upload">
            <i className="fas fa-image"></i>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
          </label>

          <div className="image-preview">
            {formData.images.map((image, index) => (
              <div key={index} className="image-box">
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt={`Imagen ${index + 1}`}
                />
                <button type="button" onClick={() => removeImage(index)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CourtForm;
