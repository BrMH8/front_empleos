import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LocationPermission from './LocationPermission';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icono personalizado para empleos
const jobIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icono personalizado para la ubicación del usuario
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para centrar el mapa en la ubicación del usuario
function LocationMarker({ position, onLocationUpdate }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 8); // Zoom más amplio para ver el estado completo
    }
  }, [position, map]);

  return position ? (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div>
          <h3>📍 Tu ubicación actual</h3>
          <p>Latitud: {position[0].toFixed(6)}</p>
          <p>Longitud: {position[1].toFixed(6)}</p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Mapeo de estados de México con sus coordenadas centrales
const ESTADOS_MEXICO = {
  'Aguascalientes': [21.8853, -102.2916],
  'Baja California': [32.5149, -117.0382],
  'Baja California Sur': [24.1426, -110.3127],
  'Campeche': [19.8301, -90.5349],
  'Chiapas': [16.7569, -93.1292],
  'Chihuahua': [28.6353, -106.0889],
  'Ciudad de México': [19.4326, -99.1332],
  'Coahuila': [27.0586, -101.7068],
  'Colima': [19.2452, -103.7241],
  'Durango': [24.0225, -104.6576],
  'Estado de México': [19.2833, -99.6533],
  'Guanajuato': [20.5888, -100.3899],
  'Guerrero': [17.4392, -99.5451],
  'Hidalgo': [20.0911, -98.7624],
  'Jalisco': [20.6597, -103.3496],
  'Michoacán': [19.7008, -101.1844],
  'Morelos': [18.9242, -99.2216],
  'Nayarit': [21.7514, -104.8455],
  'Nuevo León': [25.6866, -100.3161],
  'Oaxaca': [17.0732, -96.7266],
  'Puebla': [19.0413, -98.2062],
  'Querétaro': [20.5888, -100.3899],
  'Quintana Roo': [21.1743, -86.8466],
  'San Luis Potosí': [22.1565, -100.9855],
  'Sinaloa': [25.1721, -107.4795],
  'Sonora': [29.0729, -110.9559],
  'Tabasco': [17.8409, -92.6189],
  'Tamaulipas': [23.6345, -102.5528],
  'Tlaxcala': [19.3182, -98.2374],
  'Veracruz': [19.1738, -96.1342],
  'Yucatán': [20.9674, -89.5926],
  'Zacatecas': [22.7709, -102.5832]
};

// Mapeo de ciudades a estados
const CIUDAD_A_ESTADO = {
  'Aguascalientes': 'Aguascalientes',
  'Tijuana': 'Baja California',
  'Mexicali': 'Baja California',
  'La Paz': 'Baja California Sur',
  'Campeche': 'Campeche',
  'Tuxtla Gutiérrez': 'Chiapas',
  'Chihuahua': 'Chihuahua',
  'Ciudad Juárez': 'Chihuahua',
  'México': 'Ciudad de México',
  'Ciudad de México': 'Ciudad de México',
  'Saltillo': 'Coahuila',
  'Monclova': 'Coahuila',
  'Colima': 'Colima',
  'Durango': 'Durango',
  'Toluca': 'Estado de México',
  'León': 'Guanajuato',
  'Irapuato': 'Guanajuato',
  'Acapulco': 'Guerrero',
  'Chilpancingo': 'Guerrero',
  'Pachuca': 'Hidalgo',
  'Tula': 'Hidalgo',
  'Zacualtipán': 'Hidalgo',
  'Guadalajara': 'Jalisco',
  'Zapopan': 'Jalisco',
  'Morelia': 'Michoacán',
  'Cuernavaca': 'Morelos',
  'Tepic': 'Nayarit',
  'Monterrey': 'Nuevo León',
  'San Nicolás': 'Nuevo León',
  'Oaxaca': 'Oaxaca',
  'Puebla': 'Puebla',
  'Querétaro': 'Querétaro',
  'Cancún': 'Quintana Roo',
  'Chetumal': 'Quintana Roo',
  'San Luis Potosí': 'San Luis Potosí',
  'Culiacán': 'Sinaloa',
  'Mazatlán': 'Sinaloa',
  'Hermosillo': 'Sonora',
  'Villahermosa': 'Tabasco',
  'Reynosa': 'Tamaulipas',
  'Matamoros': 'Tamaulipas',
  'Tlaxcala': 'Tlaxcala',
  'Veracruz': 'Veracruz',
  'Xalapa': 'Veracruz',
  'Mérida': 'Yucatán',
  'Zacatecas': 'Zacatecas'
};

// Función para obtener el estado de una ciudad
const obtenerEstado = (ciudadModalidad) => {
  if (!ciudadModalidad) return 'Ciudad de México';
  
  const ciudad = ciudadModalidad.split(' - ')[0].trim();
  return CIUDAD_A_ESTADO[ciudad] || 'Ciudad de México';
};

// Función para obtener coordenadas de un estado
const getCoordinatesForEstado = (estado) => {
  return ESTADOS_MEXICO[estado] || [19.4326, -99.1332]; // México City por defecto
};

// Componente para los marcadores de empleos
function JobMarkers({ jobs, userLocation, onJobClick }) {
  const [jobLocations, setJobLocations] = useState([]);

  // Función para calcular distancia entre dos puntos
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const locations = jobs.map((job, index) => {
        const estado = obtenerEstado(job.ciudadModalidad);
        const coords = getCoordinatesForEstado(estado);
        const distance = userLocation ? calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          coords[0], 
          coords[1]
        ) : null;

        return {
          id: index,
          job: job,
          estado: estado,
          position: coords,
          distance: distance
        };
      });

      setJobLocations(locations);
    }
  }, [jobs, userLocation]);

  const handleMarkerClick = (jobData) => {
    if (onJobClick) {
      onJobClick(jobData);
    }
  };

  return jobLocations.map((jobData) => (
    <Marker 
      key={jobData.id} 
      position={jobData.position} 
      icon={jobIcon}
      eventHandlers={{
        click: () => handleMarkerClick(jobData)
      }}
    >
      <Popup>
        <div className="job-popup">
          <h3>{jobData.job.titulo}</h3>
          <p><strong>Estado:</strong> {jobData.estado}</p>
          <p><strong>Ubicación:</strong> {jobData.job.ciudadModalidad}</p>
          <p><strong>Sueldo:</strong> {jobData.job.sueldo}</p>
          <p><strong>Horario:</strong> {jobData.job.horario}</p>
          {jobData.distance && (
            <p><strong>Distancia:</strong> {jobData.distance.toFixed(1)} km</p>
          )}
          <button 
            className="job-popup-button"
            onClick={() => handleMarkerClick(jobData)}
          >
            Ver empleos del estado {jobData.estado}
          </button>
        </div>
      </Popup>
    </Marker>
  ));
}

const LocationMap = ({ onLocationSelect, jobs = [], userLocation, onJobClick }) => {
  const [position, setPosition] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error, denied
  const [locationError, setLocationError] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const mapRef = useRef(null);

  // Función para obtener la ubicación del usuario
  const getUserLocation = () => {
    setLocationStatus('loading');
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationError('La geolocalización no está soportada en este navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPosition = [pos.coords.latitude, pos.coords.longitude];
        setPosition(userPosition);
        setLocationStatus('success');
        
        // Notificar al componente padre sobre la nueva ubicación
        if (onLocationSelect) {
          onLocationSelect({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        }
      },
      (error) => {
        setLocationStatus('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Información de ubicación no disponible.');
            break;
          case error.TIMEOUT:
            setLocationError('Tiempo de espera agotado para obtener la ubicación.');
            break;
          default:
            setLocationError('Error desconocido al obtener la ubicación.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Función para manejar clics en el mapa
  const handleMapClick = (e) => {
    const clickedPosition = [e.latlng.lat, e.latlng.lng];
    setPosition(clickedPosition);
    
    if (onLocationSelect) {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        accuracy: null
      });
    }
  };

  // Obtener ubicación automáticamente al montar el componente
  useEffect(() => {
    if (permissionStatus === 'granted') {
      getUserLocation();
    }
  }, [permissionStatus]);

  // Manejar cambios en el estado de permisos
  const handlePermissionChange = (status) => {
    setPermissionStatus(status);
    if (status === 'granted') {
      getUserLocation();
    }
  };

  return (
    <div className="location-map-container">
      {/* Componente de permisos */}
      <LocationPermission onPermissionChange={handlePermissionChange} />
      
      <div className="location-controls">
        <button 
          className="location-button"
          onClick={getUserLocation}
          disabled={locationStatus === 'loading' || permissionStatus !== 'granted'}
        >
          {locationStatus === 'loading' ? (
            <>
              <div className="location-spinner"></div>
              Obteniendo ubicación...
            </>
          ) : (
            '📍 Obtener mi ubicación'
          )}
        </button>
        
        {locationStatus === 'error' && (
          <div className="location-error">
            <p>{locationError}</p>
            <button 
              className="location-retry-button"
              onClick={getUserLocation}
            >
              Reintentar
            </button>
          </div>
        )}
        
        {locationStatus === 'success' && (
          <div className="location-success">
            <p>✅ Ubicación obtenida correctamente</p>
            <p className="location-coords">
              Lat: {position?.[0]?.toFixed(6)}, Lng: {position?.[1]?.toFixed(6)}
            </p>
          </div>
        )}
      </div>

      <div className="map-wrapper">
        <MapContainer
          ref={mapRef}
          center={position || [19.4326, -99.1332]} // México City por defecto
          zoom={6} // Zoom más amplio para ver México completo
          style={{ height: '400px', width: '100%' }}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {position && (
            <LocationMarker 
              position={position} 
              onLocationUpdate={setPosition}
            />
          )}
          {jobs && jobs.length > 0 && (
            <JobMarkers 
              jobs={jobs} 
              userLocation={userLocation}
              onJobClick={onJobClick}
            />
          )}
        </MapContainer>
      </div>

      <div className="location-instructions">
        <p>💡 <strong>Instrucciones:</strong></p>
        <ul>
          <li>Haz clic en "Obtener mi ubicación" para usar tu ubicación actual</li>
          <li>O haz clic en cualquier punto del mapa para seleccionar una ubicación</li>
          <li>Los marcadores azules representan empleos por estado</li>
          <li>Haz clic en un marcador para ver empleos del mismo estado</li>
          <li>El marcador verde es tu ubicación actual</li>
          <li>Los empleos se agrupan por estado completo, no por ciudad específica</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationMap; 