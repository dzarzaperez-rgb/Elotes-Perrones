import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function LocationMap() {
  const position: [number, number] = [19.4326, -99.1332]; // Example: Mexico City Zocalo

  return (
    <section className="map-section container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <h2 className="section-title">Nuestra Ubicación</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }}>
        ¡Visítanos en la plaza principal! Aquí te esperamos con los mejores elotes.
      </p>
      <div style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <strong>Elotes Perrones</strong> <br /> Aquí estamos para servirte.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}
