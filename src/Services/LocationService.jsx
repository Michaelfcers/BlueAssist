import * as Location from 'expo-location';

let lastKnownLocation = null;
let watcherSubscription = null;

// INICIA EL RASTREO (Llamar al abrir la App)
const startLocationTracking = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado.');
      return;
    }

    // Si ya estamos rastreando, no hacer nada
    if (watcherSubscription) return;

    console.log("Iniciando rastreo GPS continuo...");

    // RASTREO CONTINUO: Alta precisión, actualiza cada 10 metros o 5 segundos
    watcherSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        // console.log("Nueva ubicación GPS capturada:", location.coords.latitude);
        lastKnownLocation = location;
      }
    );

  } catch (error) {
    console.error("Error iniciando rastreo GPS:", error);
  }
};

// OBTIENE LA UBICACIÓN (Instantáneo si el rastreo funciona)
const getLocation = async () => {
  // 1. Si tenemos una ubicación fresca del rastreo, úsala YA.
  if (lastKnownLocation) {
    // Opcional: Verificar cuán vieja es. Si es < 5 min, sirve.
    const freshness = Date.now() - lastKnownLocation.timestamp;
    if (freshness < 300000) { // 5 minutos
      return lastKnownLocation;
    }
  }

  // 2. Si no hay rastreo o está vieja, intentar forzar una lectura (Fallback)
  try {
    console.log("GPS Cache vacío o viejo. Forzando lectura...");
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    lastKnownLocation = location;
    return location;
  } catch (error) {
    console.warn("Fallo lectura forzada GPS, intentando LastKnown...");
    return await Location.getLastKnownPositionAsync({});
  }
};

export { getLocation, startLocationTracking };
