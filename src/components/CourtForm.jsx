import React, { useState, useEffect } from "react";
import "../Styles/CreateCourt.css";

const CourtForm = ({ onSubmit }) => {
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

  useEffect(() => {
    fetch("http://localhost:8080/sports/status/5")
      .then((response) => response.json())
      .then((data) => setSports(data))
      .catch((error) => console.error("Error fetching sports:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/countries/search")
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch(`http://localhost:8080/api/regions/by-country/${formData.country}`)
        .then((response) => response.json())
        .then((data) => setRegions(data))
        .catch((error) => console.error("Error fetching regions:", error));
    } else {
      setRegions([]);
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    console.log("Valor de region seleccionado:", formData.region);
    if (formData.region) {
      fetch(`http://localhost:8080/api/cities/by-region/${formData.region}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Ciudades recibidas desde API:", data);
          setCities(data);
        })
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.images.length < 5) {
      alert("Debes subir al menos 5 imágenes.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("court", JSON.stringify({
      name: formData.name,
      sport: formData.sport,
      country: formData.country,
      address: formData.address,
      capacity: formData.capacity,
      description: formData.description,
      price: formData.price,
      city: formData.city,
      region: formData.region,
      neighborhood: formData.neighborhood
    }));
  
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });
  
    try {
      const response = await fetch("http://localhost:8080/add", {
        method: "POST",
        body: formDataToSend,
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar la cancha");
      }
  
      const result = await response.json();
      console.log("Cancha creada:", result);
      alert("Cancha creada con éxito!");
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear la cancha.");
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

        <div className="image-section">
          <label>Seleccionar imagen</label>
          <label className="image-upload">
            <i className="fas fa-image"></i> Subir imágenes
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
          <button type="submit">Guardar Cancha</button>
        </div>
      </div>
    </form>
  );
};

export default CourtForm;
