# 🔍 Buscador de Empleos - Frontend

Una aplicación web moderna para buscar empleos en tecnología con funcionalidades avanzadas de geolocalización y filtrado por estados de México.

## ✨ Características Principales

### 🗺️ **Sistema de Mapeo por Estados**
- **Mapeo completo de México**: La aplicación mapea empleos por los 32 estados de México
- **Agrupación por estado**: Si tu marcador aparece en Zacualtipán (Hidalgo), se mostrarán todos los empleos del estado de Hidalgo
- **Coordenadas centrales**: Cada estado tiene coordenadas centrales precisas para ubicación en el mapa
- **Marcadores por estado**: Los empleos se agrupan y muestran como un marcador por estado

### 📍 **Geolocalización Avanzada**
- **Permisos de ubicación**: Sistema robusto de gestión de permisos del navegador
- **Ubicación automática**: Obtiene tu ubicación actual con alta precisión
- **Selección manual**: Permite hacer clic en el mapa para seleccionar ubicación
- **Marcador de usuario**: Muestra tu ubicación con un marcador verde distintivo

### 🏢 **Búsqueda y Filtrado**
- **Búsqueda en tiempo real**: Busca por tecnología, título o requisitos
- **Filtrado por salarios**: Top 10 mejores y peores salarios
- **Datos reales**: Integración con datos generados por scraping de Node.js
- **Filtrado por proximidad**: Opción para filtrar empleos cercanos a tu ubicación

### 🎯 **Funcionalidades Interactivas**
- **Mapa interactivo**: Usa Leaflet.js para visualización geográfica
- **Empleos del mismo estado**: Al hacer clic en un marcador, muestra todos los empleos del estado
- **Información detallada**: Popups con información completa de cada empleo
- **Distancias calculadas**: Muestra la distancia desde tu ubicación a cada estado

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Servidor de scraping Node.js ejecutándose en `localhost:3000` (opcional)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd buscador-hireline
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar datos de empleos**
   ```bash
   # Copiar archivos JSON de empleos al directorio público
   node copy-jobs.js
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📁 Estructura del Proyecto

```
buscador-hireline/
├── src/
│   ├── components/
│   │   ├── LocationMap.jsx          # Componente principal del mapa
│   │   └── LocationPermission.jsx   # Gestión de permisos de ubicación
│   ├── services/
│   │   └── jobDataService.js        # Servicio de datos y lógica de estados
│   ├── App.jsx                      # Componente principal de la aplicación
│   ├── App.css                      # Estilos de la aplicación
│   └── main.jsx                     # Punto de entrada
├── public/
│   └── jobs/                        # Archivos JSON de empleos
├── copy-jobs.js                     # Script para copiar datos
├── vite.config.js                   # Configuración de Vite
└── package.json                     # Dependencias del proyecto
```

## 🗺️ Sistema de Estados de México

### Estados Soportados
La aplicación incluye mapeo completo para los 32 estados de México:

- **Aguascalientes** - [21.8853, -102.2916]
- **Baja California** - [32.5149, -117.0382]
- **Baja California Sur** - [24.1426, -110.3127]
- **Campeche** - [19.8301, -90.5349]
- **Chiapas** - [16.7569, -93.1292]
- **Chihuahua** - [28.6353, -106.0889]
- **Ciudad de México** - [19.4326, -99.1332]
- **Coahuila** - [27.0586, -101.7068]
- **Colima** - [19.2452, -103.7241]
- **Durango** - [24.0225, -104.6576]
- **Estado de México** - [19.2833, -99.6533]
- **Guanajuato** - [20.5888, -100.3899]
- **Guerrero** - [17.4392, -99.5451]
- **Hidalgo** - [20.0911, -98.7624]
- **Jalisco** - [20.6597, -103.3496]
- **Michoacán** - [19.7008, -101.1844]
- **Morelos** - [18.9242, -99.2216]
- **Nayarit** - [21.7514, -104.8455]
- **Nuevo León** - [25.6866, -100.3161]
- **Oaxaca** - [17.0732, -96.7266]
- **Puebla** - [19.0413, -98.2062]
- **Querétaro** - [20.5888, -100.3899]
- **Quintana Roo** - [21.1743, -86.8466]
- **San Luis Potosí** - [22.1565, -100.9855]
- **Sinaloa** - [25.1721, -107.4795]
- **Sonora** - [29.0729, -110.9559]
- **Tabasco** - [17.8409, -92.6189]
- **Tamaulipas** - [23.6345, -102.5528]
- **Tlaxcala** - [19.3182, -98.2374]
- **Veracruz** - [19.1738, -96.1342]
- **Yucatán** - [20.9674, -89.5926]
- **Zacatecas** - [22.7709, -102.5832]

### Mapeo de Ciudades a Estados
El sistema incluye un mapeo automático de ciudades principales a sus estados correspondientes:

```javascript
// Ejemplos de mapeo
'Zacualtipán' → 'Hidalgo'
'Guadalajara' → 'Jalisco'
'Monterrey' → 'Nuevo León'
'Puebla' → 'Puebla'
'México' → 'Ciudad de México'
```

## 🎯 Cómo Usar

### 1. **Búsqueda de Empleos**
- Escribe términos como "Laravel", "JavaScript", "PHP" en el campo de búsqueda
- Presiona Enter o haz clic en "Buscar"
- Los resultados se mostrarán con opciones de filtrado por salarios

### 2. **Uso del Mapa**
- Haz clic en "🗺️ Mostrar Mapa" para abrir el mapa
- Permite acceso a tu ubicación cuando el navegador lo solicite
- Tu ubicación aparecerá como un marcador verde
- Los empleos se mostrarán como marcadores azules por estado

### 3. **Explorar Empleos por Estado**
- Haz clic en cualquier marcador azul de empleo
- Se mostrará la información del empleo seleccionado
- Aparecerán todos los demás empleos disponibles en el mismo estado
- Usa el botón "✕" para cerrar la vista detallada

### 4. **Filtrado por Salarios**
- Usa los botones de radio para cambiar entre:
  - **Todos**: Muestra todos los empleos encontrados
  - **Mejores salarios**: Top 10 empleos con mejores salarios
  - **Peores salarios**: Top 10 empleos con menores salarios

## 🔧 Configuración Avanzada

### Proxy para Backend
El archivo `vite.config.js` incluye configuración de proxy para conectar con el servidor de scraping:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Archivos de Datos
Los archivos JSON de empleos deben estar en `public/jobs/` con nombres como:
- `vacantes-laravel.json`
- `vacantes-javascript.json`
- `vacantes-php.json`
- `vacantes-VueJS.json`
- `vacantes-desarrollador junior.json`

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **Leaflet.js** - Biblioteca de mapas interactivos
- **React-Leaflet** - Componentes React para Leaflet
- **Axios** - Cliente HTTP para peticiones
- **CSS3** - Estilos modernos y responsivos

## 📱 Características Responsivas

- **Diseño adaptable**: Funciona en dispositivos móviles y de escritorio
- **Mapa responsivo**: Se adapta al tamaño de la pantalla
- **Navegación táctil**: Soporte para gestos táctiles en móviles
- **Interfaz optimizada**: UI optimizada para diferentes tamaños de pantalla

## 🔒 Permisos de Ubicación

La aplicación solicita permisos de ubicación para:
- Mostrar tu ubicación en el mapa
- Calcular distancias a empleos
- Filtrar empleos por proximidad

### Estados de Permisos
- **Concedido**: Ubicación disponible inmediatamente
- **Denegado**: Opción para abrir configuración del navegador
- **Pendiente**: Solicitud automática de permisos
- **No soportado**: Mensaje informativo para el usuario

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Servir Archivos Estáticos
```bash
npm run preview
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes preguntas o problemas:
- Abre un issue en GitHub
- Revisa la documentación de las dependencias
- Verifica la configuración del servidor de scraping

---

**¡Disfruta explorando empleos por todo México! 🇲🇽** 