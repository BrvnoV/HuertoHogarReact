import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { locations } from '../../data/constants'; // Importamos las coordenadas

// Posición central del mapa (Santiago)
const center: [number, number] = [-33.4489, -70.6693];

export default function About() {
  return (
    // Usamos un Fragmento (<>) porque la página (Nosotros.tsx)
    // ya nos da la <section> y el <container>.
    <>
      <h2 className="text-center mb-4" style={{ color: 'white' }}>Nosotros</h2>
      
      <p style={{ color: 'white' }}>
        HuertoHogar es una tienda online dedicada a llevar la frescura y calidad 
        de los productos del campo directamente a tu hogar en Chile. Con más 
        de 6 años de experiencia, operamos en ciudades como Santiago, 
        Puerto Montt, Villarica, Nacimiento, Viña del Mar, Valparaíso y Concepción.
      </p>

      {/* El componente MapContainer reemplaza tu antiguo L.map('map').
        Asegúrate de que tu style.css SÍ tenga un alto definido para #map
        o usa un estilo en línea como style={{ height: '400px' }}.
        Tu CSS original ya tiene:
        #map { height: 400px; width: 100%; }
      */}
      <MapContainer id="map" center={center} zoom={6}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Mapeamos las ubicaciones desde constants.ts para crear los marcadores */}
        {locations.map((loc) => (
          <Marker key={loc.name} position={loc.coords}>
            <Popup>
              {loc.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}