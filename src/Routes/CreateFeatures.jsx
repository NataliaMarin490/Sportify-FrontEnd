import React, { useState, useRef } from "react";
import API_BASE_URL from "../config";
import "../Styles/addFeatureCategory.css";
import { FaImage, FaTimes } from "react-icons/fa";
import BackButton from "../components/BackButton";

const CreateFeatures = () => {
  const [feature, setFeature] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFeature(e.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feature.trim()) {
      alert("Debe ingresar una característica.");
      return;
    }
    if (!image) {
      alert("Debe subir una imagen.");
      return;
    }

    const featureData = JSON.stringify({
      feature: feature,
      statusId: 24,
    });

    const formData = new FormData();
    formData.append(
      "feature",
      new Blob([featureData], { type: "application/json" })
    );
    formData.append("images", image);

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/public/features/add",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error al guardar la característica");

      alert("Característica creada con éxito!");
      setFeature("");
      setImage(null);
    } catch (error) {
      alert("Hubo un error al crear la característica.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-features-container">
      <BackButton/>
      <form className="form" onSubmit={handleSubmit}>
        <h1>Crear Característica</h1>
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
          <div className="image-upload-icon" onClick={handleIconClick}>
            <FaImage />
          </div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
        </label>
        {image && (
          <div className="image-preview-container">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="preview"
            />
            <FaTimes
              className="remove-image-icon"
              onClick={handleRemoveImage}
            />
          </div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
};

export default CreateFeatures;
