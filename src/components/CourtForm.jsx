import { useState, useEffect } from "react";
import "../Styles/CreateCourt.css";
import API_BASE_URL from "../config";

const CourtForm = ({ onSubmit, courtId, isEditing }) => {
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

  const [sports, setSports] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/sports/status/5`)
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error("Error fetching sports:", error));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/countries/search`)
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch(`${API_BASE_URL}/regions/by-country/${formData.country}`)
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
      fetch(`${API_BASE_URL}/cities/by-region/${formData.region}`)
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
      const newImages = [...formData.images, ...Array.from(files)];
      setFormData({ ...formData, images: newImages });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/features`)
      .then((response) => response.json())
      .then((data) => setFeatures(data))
      .catch((error) => console.error("Error fetching features:", error));
  }, []);

  useEffect(() => {
    if (isEditing && courtId) {
      fetch(`${API_BASE_URL}/courts/search/${courtId}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            ...formData,
            name: data.name,
            sport: data.sport,
            city: data.city,
            address: data.address,
            description: data.description,
            price: data.pricePerHour,
            capacity: data.capacity,
            neighborhood: data.neighborhood,
          });
          // Convertir características activas en IDs
          setSelectedFeatures(data.features);
        })
        .catch((error) => console.error("Error fetching court:", error));
    }
  }, [courtId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length < 5) {
      alert("Debes subir al menos 5 imágenes.");
      return;
    }

    setIsLoading(true); // Activar el estado de carga

    const formDataToSend = new FormData();

    // Crear el objeto JSON para la cancha con el formato requerido
    const courtData = {
      name: formData.name,
      description: formData.description,
      capacity: formData.capacity,
      pricePerHour: formData.price,
      address: formData.address,
      neighborhood: formData.neighborhood,
      sportId: formData.sport,
      cityId: formData.city,
      statusId: 1,
      featuresIds: selectedFeatures,
    };

    formDataToSend.append("court", JSON.stringify(courtData));

    // Agregar las imágenes al FormData
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/courts/add`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Error al guardar la cancha");
      }

      const result = await response.json();
      alert("Cancha creada con éxito!");

      // Limpiar el formulario
      setFormData({
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
      setSelectedFeatures([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear la cancha.");
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <form className="court" onSubmit={handleSubmit}>
      <h1>Agregar cancha</h1>
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
              value={formData.countryName}
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
          <div className="features-grid">
            {features.map((feature) => (
              <label key={feature.idFeature} className="feature-item">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature.idFeature)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFeatures([
                        ...selectedFeatures,
                        feature.idFeature,
                      ]);
                    } else {
                      setSelectedFeatures(
                        selectedFeatures.filter((f) => f !== feature.idFeature)
                      );
                    }
                  }}
                />
                <img src={feature.imageUrl} alt={feature.feature} />
                {feature.feature}
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
                  src={URL.createObjectURL(image)}
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
            {isLoading ? "Guardando..." : "Guardar Cancha"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CourtForm;
