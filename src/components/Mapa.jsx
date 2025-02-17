import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  const posicion = [7.7682, -72.225]; // Coordenadas de San Cristóbal, Táchira

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <MapContainer
        center={posicion}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={posicion}>
          <Popup>Ubicación seleccionada</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Mapa;
