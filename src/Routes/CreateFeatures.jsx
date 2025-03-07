import React, { useState, useRef } from "react";
import API_BASE_URL from "../config";
import "../Styles/addFeatureCategory.css";
import { FaImage, FaTimes } from "react-icons/fa";

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
      setImage(e.target.files[0]); // Almacena la imagen seleccionada
      e.target.value = null; // Restablece el input de archivo
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click(); // Abre el explorador de archivos
  };

  const handleRemoveImage = () => {
    setImage(null); // Elimina la imagen seleccionada
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feature.trim() || !image) {
      alert("Debe ingresar una característica y subir una imagen.");
      return;
    }
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("feature", JSON.stringify({ feature: feature })); // Convertir el feature a un objeto JSON
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
    } catch (error) {
      alert("Hubo un error al crear la característica.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="create-features-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Característica</h1>
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
            required
          />
        </label>
        {image && (
          <div className="image-preview-container">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="preview"
            />
            <FaTimes className="remove-image-icon" onClick={handleRemoveImage} />
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