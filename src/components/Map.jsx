import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const position = [7.7682, -72.225];

  return (
    <div style={{ width: "100%", height: "400px", border: "5px" }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>Ubicación seleccionada</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
