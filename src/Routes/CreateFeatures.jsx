import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";
import "../Styles/addFeatureCategory.css";
import { FaImage, FaTimes } from "react-icons/fa";
import BackButton from "../components/BackButton";
import axios from "axios";


const CreateFeatures = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feature, setFeature] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE_URL}/public/features/${id}`)
        .then((response) => {
          setFeature(response.data.feature);
          setCurrentImage(response.data.imageUrl);
        })
        .catch((error) => {
          console.error("Error al cargar la característica:", error);
        });
    }
  }, [id]);

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
    setCurrentImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feature.trim()) {
      alert("Debe ingresar una característica.");
      return;
    }

    const featureData = JSON.stringify({
      feature: feature,
    });

    const formData = new FormData();
    formData.append(
      "feature",
      new Blob([featureData], { type: "application/json" })
    );
    if (image) {
      formData.append("image", image);
    }

    setIsLoading(true);
    try {
      let response;
      if (id) {
        response = await axios.put(
          `${API_BASE_URL}/public/features/${id}/update`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/public/features/add`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      alert("Característica guardada con éxito!");
      navigate("/administracion/features");
    } catch (error) {
      alert("Hubo un error al guardar la característica.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-features-container">
      <BackButton />
      <form className="form" onSubmit={handleSubmit}>
        <h1>{id ? "Editar Característica" : "Crear Característica"}</h1>
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
        {currentImage && !image && (
          <div className="image-preview-container">
            <img src={currentImage} alt="Actual" className="preview" />
            <FaTimes
              className="remove-image-icon"
              onClick={handleRemoveImage}
            />
          </div>
        )}
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
