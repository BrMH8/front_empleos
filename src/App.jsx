import { useState } from 'react';
import './App.css';
import LocationMap from './components/LocationMap';
import { 
  searchJobs, 
  getNearbyJobs, 
  getJobsByEstado, 
  getAllJobs, 
  obtenerEstado, 
  getCoordinatesForEstado 
} from './services/jobDataService';

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [top10, setTop10] = useState([]);
  const [bottom10, setBottom10] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewFilter, setViewFilter] = useState("all"); 
  const [userLocation, setUserLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [locationFilter, setLocationFilter] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [nearbyJobs, setNearbyJobs] = useState([]);
  const [showNearbyJobs, setShowNearbyJobs] = useState(false);

  
  const calcularTopYBottom = (data) => {
    const dataConSalario = data.map((item) => {
      const salarioStr = item.sueldo || "";
      const numeros = salarioStr.match(/[\d,]+/g);
      let salarioNum = 0;
      if (numeros) {
        const lastNumber = numeros[numeros.length - 1].replace(/,/g, "");
        salarioNum = parseInt(lastNumber, 10);
      }
      return { ...item, salarioNum };
    }).filter((item) => item.salarioNum > 0);

    if (dataConSalario.length > 0) {
      const ordenDesc = [...dataConSalario].sort((a, b) => b.salarioNum - a.salarioNum);
      const ordenAsc = [...dataConSalario].sort((a, b) => a.salarioNum - b.salarioNum);
      let sliceCount = 10;
      if (dataConSalario.length <= 3) {
        sliceCount = 1;
      } else if (dataConSalario.length <= 10) {
        sliceCount = 3;
      }
      setTop10(ordenDesc.slice(0, sliceCount));
      setBottom10(ordenAsc.slice(0, sliceCount));
    } else {
      setTop10([]);
      setBottom10([]);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setTop10([]);
    setBottom10([]);
    setViewFilter("all");

    try {
      
      const response = await fetch(`https://scraping-empleos.vercel.app/api/vacantes?busqueda=${query.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Datos recibidos del servidor:', data);
        console.log('📊 Total de datos en data.data:', data.data?.length || 0);
        
        
        const allResults = data.data || [];
        console.log('📊 Resultados sin filtrar:', allResults.length);
        
        setResults(allResults);
        calcularTopYBottom(allResults);
        
        console.log('📊 Resultados finales establecidos:', allResults.length);
      } else {
        console.log('❌ Servidor respondió con error, usando datos locales...');
        
        const localResults = await searchJobs(query);
        setResults(localResults);
        calcularTopYBottom(localResults);
      }
    } catch (err) {
      console.error('❌ Error en búsqueda:', err);
      // Fallback a datos locales
      try {
        const localResults = await searchJobs(query);
        setResults(localResults);
        calcularTopYBottom(localResults);
      } catch (localErr) {
        setError('Error al buscar empleos. Por favor, intenta de nuevo.');
        setResults([]);
      }
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleLocationSelect = (location) => {
    setUserLocation(location);
    console.log('Ubicación seleccionada:', location);
  };

  const handleJobClick = async (jobData) => {
    setSelectedJob(jobData.job);
    
    try {
     
      const allJobs = await getAllJobs();
      
     
      const estadoJobs = getJobsByEstado(jobData.estado, allJobs);
      
      const filteredJobs = estadoJobs.filter(job => 
        job.titulo !== jobData.job.titulo
      );
      
      setNearbyJobs(filteredJobs);
      setShowNearbyJobs(true);
    } catch (error) {
      console.error('Error obteniendo empleos del estado:', error);
      setNearbyJobs([]);
    }
  };

  const closeSelectedJob = () => {
    setSelectedJob(null);
    setNearbyJobs([]);
    setShowNearbyJobs(false);
  };

  
  const getDistance = (ciudadModalidad) => {
    if (!userLocation || !ciudadModalidad) return null;
    
    const estado = obtenerEstado(ciudadModalidad);
    const coords = getCoordinatesForEstado(estado);
    
    const R = 6371; 
    const dLat = (coords[0] - userLocation.lat) * Math.PI / 180;
    const dLon = (coords[1] - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(coords[0] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="jobsearch-container">
      <div className="jobsearch-header">
        <h1>🔍 Buscador de Empleos</h1>
        <p>Encuentra las mejores oportunidades laborales en tecnología</p>
      </div>

      <div className="jobsearch-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empleos (ej: Laravel, JavaScript, PHP...)"
          className="jobsearch-input"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="jobsearch-button" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {loading && (
        <div className="jobsearch-loading">
          <div className="loading-spinner"></div>
          <p>Buscando empleos...</p>
        </div>
      )}

      {error && (
        <div className="jobsearch-error">
          <p>{error}</p>
          <button onClick={handleSearch} className="retry-button">
            Reintentar
          </button>
        </div>
      )}

      {hasSearched && !loading && results.length === 0 && (
        <div className="jobsearch-no-results">
          <p>No se encontraron empleos para "{query}"</p>
          <p>Intenta con otros términos de búsqueda</p>
        </div>
      )}

      {/* Filtro de visualización */}
      {hasSearched && !loading && results.length > 0 && (
        <div className="jobsearch-filter">
          <label>
            <input 
              type="radio" 
              name="viewFilter" 
              value="all" 
              checked={viewFilter === "all"} 
              onChange={() => setViewFilter("all")} 
            />
            Todos
          </label>
          <label>
            <input 
              type="radio" 
              name="viewFilter" 
              value="top" 
              checked={viewFilter === "top"} 
              onChange={() => setViewFilter("top")} 
            />
            Mejores salarios
          </label>
          <label>
            <input 
              type="radio" 
              name="viewFilter" 
              value="bottom" 
              checked={viewFilter === "bottom"} 
              onChange={() => setViewFilter("bottom")} 
            />
            Peores salarios
          </label>
        </div>
      )}

     

      {/* Resultados filtrados */}
      {console.log('🔍 Estado antes del renderizado:', { hasSearched, loading, resultsLength: results.length, viewFilter })}
      {hasSearched && !loading && results.length > 0 && (
        <div className="jobsearch-results-container">
          {viewFilter === "all" && (
            <div className="jobsearch-results-column">
              <h2>Todos los empleos ({results.length})</h2>
              {console.log('🎯 Renderizando cards para viewFilter="all", total:', results.length)}
              {results.map((item, idx) => {
                console.log(`🎯 Renderizando card ${idx + 1}:`, item?.titulo);
                return (
                  <div key={idx} className="jobsearch-card">
                    <h3 className="jobsearch-card-title">{item?.titulo}</h3>
                    <p className="jobsearch-card-sueldo">{item?.sueldo}</p>
                    <p className="jobsearch-card-text">{item?.horario}</p>
                    <div className="jobsearch-card-footer">
                      <span>{item?.ciudadModalidad}</span>
                      {userLocation && getDistance(item?.ciudadModalidad) && (
                        <span className="jobsearch-card-distance">
                          📍 {getDistance(item?.ciudadModalidad).toFixed(1)} km
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewFilter === "top" && top10.length > 0 && (
            <div className="jobsearch-results-column">
              <h2>Mejores salarios ({top10.length})</h2>
              {top10.map((item, idx) => (
                <div key={idx} className="jobsearch-card">
                  <h3 className="jobsearch-card-title">{item?.titulo}</h3>
                  <p className="jobsearch-card-sueldo">{item?.sueldo}</p>
                  <p className="jobsearch-card-text">{item?.horario}</p>
                  <div className="jobsearch-card-footer">
                    <span>{item?.ciudadModalidad}</span>
                    {userLocation && getDistance(item?.ciudadModalidad) && (
                      <span className="jobsearch-card-distance">
                        📍 {getDistance(item?.ciudadModalidad).toFixed(1)} km
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewFilter === "bottom" && bottom10.length > 0 && (
            <div className="jobsearch-results-column">
              <h2>Peores salarios ({bottom10.length})</h2>
              {bottom10.map((item, idx) => (
                <div key={idx} className="jobsearch-card">
                  <h3 className="jobsearch-card-title">{item?.titulo}</h3>
                  <p className="jobsearch-card-sueldo">{item?.sueldo}</p>
                  <p className="jobsearch-card-text">{item?.horario}</p>
                  <div className="jobsearch-card-footer">
                    <span>{item?.ciudadModalidad}</span>
                    {userLocation && getDistance(item?.ciudadModalidad) && (
                      <span className="jobsearch-card-distance">
                        📍 {getDistance(item?.ciudadModalidad).toFixed(1)} km
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(viewFilter === "top" && top10.length === 0) ||
          (viewFilter === "bottom" && bottom10.length === 0) ? (
            <p className="jobsearch-no-results">
              No hay suficientes empleos con salario para mostrar.
            </p>
          ) : null}
        </div>
      )}

      {/* Controles de ubicación */}
      <div className="location-section">
        <div className="location-toggle">
          <button 
            className="location-toggle-button"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? '🗺️ Ocultar Mapa' : '🗺️ Mostrar Mapa'}
          </button>
          
          {userLocation && (
            <label className="location-filter-checkbox">
              <input 
                type="checkbox" 
                checked={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.checked)}
              />
              Filtrar por proximidad
            </label>
          )}
        </div>

        {userLocation && (
          <div className="current-location">
            <p>📍 Tu ubicación: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
          </div>
        )}
      </div>

      {/* Mapa */}
      {showMap && (
        <div className="map-section">
          <LocationMap 
            onLocationSelect={handleLocationSelect}
            jobs={results}
            userLocation={userLocation}
            onJobClick={handleJobClick}
          />
        </div>
      )}

      {/* Empleo seleccionado y empleos del mismo estado */}
      {/* {selectedJob && showNearbyJobs && (
        <div className="selected-job-section">
          <div className="selected-job-card">
            <button className="close-selected-job" onClick={closeSelectedJob}>
              ✕
            </button>
            <h2>📋 Empleo Seleccionado</h2>
            <h3>{selectedJob.titulo}</h3>
            <p><strong>Sueldo:</strong> {selectedJob.sueldo}</p>
            <p><strong>Horario:</strong> {selectedJob.horario}</p>
            <p><strong>Ubicación:</strong> {selectedJob.ciudadModalidad}</p>
            {selectedJob.requisitos && (
              <p><strong>Requisitos:</strong> {selectedJob.requisitos}</p>
            )}
          </div>

          <div className="nearby-jobs-section">
            <h2>🏢 Otros empleos del mismo estado</h2>
            {nearbyJobs.length > 0 ? (
              <div className="nearby-jobs-grid">
                {nearbyJobs.slice(0, 10).map((job, idx) => (
                  <div key={idx} className="nearby-job-card">
                    <h4>{job.titulo}</h4>
                    <p><strong>Sueldo:</strong> {job.sueldo}</p>
                    <p><strong>Horario:</strong> {job.horario}</p>
                    <p><strong>Ubicación:</strong> {job.ciudadModalidad}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-nearby-jobs">
                No hay otros empleos disponibles en este estado.
              </p>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
}

export default App;