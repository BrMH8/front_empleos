// Servicio para manejar los datos de empleos generados por scraping
import axios from 'axios';

// Mapeo de archivos JSON disponibles
const JOB_FILES = {
  'laravel': 'vacantes-laravel.json',
  'javascript': 'vacantes-javascript.json',
  'php': 'vacantes-php.json',
  'vuejs': 'vacantes-VueJS.json',
  'desarrollador junior': 'vacantes-desarrollador junior.json'
};

// Cache para almacenar los datos cargados
let jobDataCache = {};

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
export const obtenerEstado = (ciudadModalidad) => {
  if (!ciudadModalidad) return 'Ciudad de México';
  
  const ciudad = ciudadModalidad.split(' - ')[0].trim();
  return CIUDAD_A_ESTADO[ciudad] || 'Ciudad de México';
};

// Función para obtener coordenadas de un estado
export const getCoordinatesForEstado = (estado) => {
  return ESTADOS_MEXICO[estado] || [19.4326, -99.1332]; // México City por defecto
};

// Función para cargar datos de un archivo específico
const loadJobFile = async (filename) => {
  try {
    // Intentar cargar desde el directorio público
    const response = await axios.get(`/jobs/${filename}`);
    return response.data;
  } catch (error) {
    console.log(`No se pudo cargar ${filename} desde /jobs/, intentando desde el servidor...`);
    
    // Fallback: intentar desde el servidor de scraping
    try {
      const serverResponse = await axios.get(`https://scraping-empleos.onrender.com:10000/api/vacantes?busqueda=${filename.replace('.json', '')}`);
      return serverResponse.data.data || [];
    } catch (serverError) {
      console.error(`Error cargando ${filename}:`, serverError);
      return [];
    }
  }
};

// Función para obtener todos los empleos disponibles
export const getAllJobs = async () => {
  const allJobs = [];
  
  for (const [key, filename] of Object.entries(JOB_FILES)) {
    if (!jobDataCache[key]) {
      try {
        const jobs = await loadJobFile(filename);
        jobDataCache[key] = jobs;
      } catch (error) {
        console.error(`Error cargando empleos de ${key}:`, error);
        jobDataCache[key] = [];
      }
    }
    allJobs.push(...jobDataCache[key]);
  }
  
  return allJobs;
};

// Función para buscar empleos por término
export const searchJobs = async (query) => {
  if (!query || query.trim() === '') {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const allJobs = await getAllJobs();
  
  // Buscar en título, requisitos y ciudad/modalidad
  return allJobs.filter(job => {
    const title = job.titulo?.toLowerCase() || '';
    const requirements = job.requisitos?.toLowerCase() || '';
    const location = job.ciudadModalidad?.toLowerCase() || '';
    
    return title.includes(searchTerm) || 
           requirements.includes(searchTerm) || 
           location.includes(searchTerm);
  });
};

// Función para obtener empleos por tecnología específica
export const getJobsByTechnology = async (technology) => {
  const techKey = technology.toLowerCase();
  
  if (JOB_FILES[techKey]) {
    if (!jobDataCache[techKey]) {
      try {
        const jobs = await loadJobFile(JOB_FILES[techKey]);
        jobDataCache[techKey] = jobs;
      } catch (error) {
        console.error(`Error cargando empleos de ${technology}:`, error);
        return [];
      }
    }
    return jobDataCache[techKey];
  }
  
  // Si no hay archivo específico, buscar en todos los empleos
  return searchJobs(technology);
};

// Función para obtener empleos cercanos por estado
export const getNearbyJobs = (selectedJob, allJobs, userLocation, maxDistance = 50) => {
  if (!selectedJob || !allJobs || !userLocation) {
    return [];
  }

  const selectedJobEstado = obtenerEstado(selectedJob.ciudadModalidad);
  const selectedJobCoords = getCoordinatesForEstado(selectedJobEstado);
  
  return allJobs
    .map(job => {
      const jobEstado = obtenerEstado(job.ciudadModalidad);
      const jobCoords = getCoordinatesForEstado(jobEstado);
      const distance = calculateDistance(
        selectedJobCoords[0], 
        selectedJobCoords[1], 
        jobCoords[0], 
        jobCoords[1]
      );
      
      return {
        ...job,
        estado: jobEstado,
        distance: distance
      };
    })
    .filter(job => job.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 15); // Mostrar máximo 15 empleos cercanos
};

// Función para obtener empleos del mismo estado
export const getJobsByEstado = (estado, allJobs) => {
  if (!estado || !allJobs) return [];
  
  return allJobs
    .map(job => ({
      ...job,
      estado: obtenerEstado(job.ciudadModalidad)
    }))
    .filter(job => job.estado === estado);
};

// Función para obtener coordenadas de una ciudad (mantener compatibilidad)
const getCoordinatesForCity = (ciudadModalidad) => {
  const estado = obtenerEstado(ciudadModalidad);
  return getCoordinatesForEstado(estado);
};

// Función para calcular distancia entre dos puntos (fórmula de Haversine)
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

// Función para limpiar el cache
export const clearCache = () => {
  jobDataCache = {};
};

// Función para obtener estadísticas de los datos
export const getJobStats = async () => {
  const allJobs = await getAllJobs();
  
  const stats = {
    total: allJobs.length,
    byEstado: {},
    bySalary: {
      'Sueldo oculto': 0,
      'Menos de $20,000': 0,
      '$20,000 - $30,000': 0,
      '$30,000 - $50,000': 0,
      'Más de $50,000': 0
    }
  };

  allJobs.forEach(job => {
    // Estadísticas por estado
    const estado = obtenerEstado(job.ciudadModalidad);
    stats.byEstado[estado] = (stats.byEstado[estado] || 0) + 1;

    // Estadísticas por salario
    const salary = job.sueldo || '';
    if (salary.includes('Sueldo oculto')) {
      stats.bySalary['Sueldo oculto']++;
    } else if (salary.includes('$ 15,000') || salary.includes('$ 20,000')) {
      stats.bySalary['Menos de $20,000']++;
    } else if (salary.includes('$ 25,000') || salary.includes('$ 30,000')) {
      stats.bySalary['$20,000 - $30,000']++;
    } else if (salary.includes('$ 35,000') || salary.includes('$ 40,000') || salary.includes('$ 45,000')) {
      stats.bySalary['$30,000 - $50,000']++;
    } else if (salary.includes('$ 50,000') || salary.includes('$ 60,000') || salary.includes('$ 70,000') || salary.includes('$ 80,000') || salary.includes('$ 90,000')) {
      stats.bySalary['Más de $50,000']++;
    }
  });

  return stats;
}; 