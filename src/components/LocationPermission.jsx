import { useState, useEffect } from 'react';

const LocationPermission = ({ onPermissionChange }) => {
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar si la geolocalización está soportada
    if (navigator.geolocation) {
      setIsSupported(true);
      checkPermissionStatus();
    } else {
      setIsSupported(false);
      setPermissionStatus('not-supported');
    }
  }, []);

  const checkPermissionStatus = async () => {
    try {
      // Verificar el estado del permiso usando la API de Permissions si está disponible
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        // Escuchar cambios en el permiso
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state);
          if (onPermissionChange) {
            onPermissionChange(permission.state);
          }
        });
      } else {
        // Fallback para navegadores que no soportan la API de Permissions
        setPermissionStatus('unknown');
      }
    } catch (error) {
      console.error('Error al verificar permisos:', error);
      setPermissionStatus('unknown');
    }
  };

  const requestPermission = () => {
    if (!isSupported) return;

    navigator.geolocation.getCurrentPosition(
      () => {
        setPermissionStatus('granted');
        if (onPermissionChange) {
          onPermissionChange('granted');
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionStatus('denied');
            if (onPermissionChange) {
              onPermissionChange('denied');
            }
            break;
          case error.POSITION_UNAVAILABLE:
            setPermissionStatus('unavailable');
            break;
          case error.TIMEOUT:
            setPermissionStatus('timeout');
            break;
          default:
            setPermissionStatus('error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const openSettings = () => {
    // Intentar abrir la configuración del navegador
    if (navigator.userAgent.includes('Chrome')) {
      alert('Para habilitar la ubicación en Chrome:\n1. Haz clic en el ícono del candado en la barra de direcciones\n2. Selecciona "Permitir" para la ubicación\n3. Recarga la página');
    } else if (navigator.userAgent.includes('Firefox')) {
      alert('Para habilitar la ubicación en Firefox:\n1. Haz clic en el ícono del candado en la barra de direcciones\n2. Selecciona "Permitir" para la ubicación\n3. Recarga la página');
    } else if (navigator.userAgent.includes('Safari')) {
      alert('Para habilitar la ubicación en Safari:\n1. Ve a Safari > Preferencias > Sitios web > Ubicación\n2. Selecciona "Permitir" para este sitio\n3. Recarga la página');
    } else {
      alert('Para habilitar la ubicación:\n1. Busca el ícono de ubicación en la barra de direcciones\n2. Selecciona "Permitir"\n3. Recarga la página');
    }
  };

  if (!isSupported) {
    return (
      <div className="location-permission-warning">
        <p>⚠️ La geolocalización no está soportada en este navegador.</p>
        <p>Por favor, usa un navegador moderno como Chrome, Firefox o Safari.</p>
      </div>
    );
  }

  return (
    <div className="location-permission-container">
      <div className="permission-status">
        <span className="permission-icon">
          {permissionStatus === 'granted' && '✅'}
          {permissionStatus === 'denied' && '❌'}
          {permissionStatus === 'prompt' && '❓'}
          {permissionStatus === 'unknown' && '❓'}
        </span>
        
        <span className="permission-text">
          {permissionStatus === 'granted' && 'Permisos de ubicación concedidos'}
          {permissionStatus === 'denied' && 'Permisos de ubicación denegados'}
          {permissionStatus === 'prompt' && 'Permisos de ubicación pendientes'}
          {permissionStatus === 'unknown' && 'Estado de permisos desconocido'}
        </span>
      </div>

      {permissionStatus === 'denied' && (
        <div className="permission-actions">
          <button 
            className="permission-button permission-settings"
            onClick={openSettings}
          >
            🔧 Abrir configuración
          </button>
          <p className="permission-help">
            Necesitas habilitar los permisos de ubicación en tu navegador para usar esta función.
          </p>
        </div>
      )}

      {permissionStatus === 'prompt' && (
        <div className="permission-actions">
          <button 
            className="permission-button permission-request"
            onClick={requestPermission}
          >
            📍 Solicitar permisos de ubicación
          </button>
          <p className="permission-help">
            Haz clic para permitir que el sitio acceda a tu ubicación.
          </p>
        </div>
      )}

      {permissionStatus === 'unknown' && (
        <div className="permission-actions">
          <button 
            className="permission-button permission-request"
            onClick={requestPermission}
          >
            📍 Probar permisos de ubicación
          </button>
          <p className="permission-help">
            Haz clic para verificar si podemos acceder a tu ubicación.
          </p>
        </div>
      )}

      {permissionStatus === 'granted' && (
        <div className="permission-success">
          <p>✅ Puedes usar todas las funciones de ubicación</p>
        </div>
      )}
    </div>
  );
};

export default LocationPermission; 