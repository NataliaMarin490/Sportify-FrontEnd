import { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import "../Styles/CreateCourt.css";

const FeatureForm = ({ onSubmit }) => {
  const [feature, setFeature] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "feature") {
      setFeature(e.target.value);
    } else if (e.target.name === "image" && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feature.trim() || !image) {
      alert("Debe ingresar una característica y subir una imagen.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("feature", feature);
    formData.append("statusId", 24);
    formData.append("image", image);

    try {
      const response = await fetch(`${API_BASE_URL}/features/add`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error al guardar la característica");
      alert("Característica creada con éxito!");
      setFeature("");
      setImage(null);
      onSubmit && onSubmit();
    } catch (error) {
      alert("Hubo un error al crear la característica.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Agregar Característica</h1>
      <label>
        Característica:
        <input
          type="text"
          name="feature"
          value={feature}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Imagen:
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </label>
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="preview"
        />
      )}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
};

export default FeatureForm;
