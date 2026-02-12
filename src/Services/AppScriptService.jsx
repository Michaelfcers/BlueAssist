import AsyncStorage from '@react-native-async-storage/async-storage';

async function sendAttendanceData(data) {
  // REMOVED: isSending check. QueueService handles concurrency.

  try {
    console.log("Enviando datos a:", process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL);

    // Timeout Promise (15 segundos)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_ERROR')), 15000)
    );

    // Network Request Promise
    const fetchPromise = fetch(process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      redirect: 'follow',
    });

    // Race: El primero que termine gana
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    console.log("Status:", response.status, "URL Final:", response.url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${text.slice(0, 100)}`);
    }

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error("Error parseando respuesta JSON:", text.slice(0, 200));
      if (text.includes("Google Drive") || text.includes("sign in")) {
        throw new Error("Error de acceso (Google HTML). Verifica el despliegue del Script.");
      }
      throw new Error("Respuesta inválida del servidor.");
    }

    if (result.result === 'error') {
      throw new Error(result.error || 'Error desconocido en el script');
    }

  } catch (error) {
    if (error.message === 'TIMEOUT_ERROR') {
      console.error("Timeout: La conexión tardó demasiado (Promise.race).");
      throw new Error("La conexión es lenta.");
    }

    console.error('Hubo un error:', error);
    throw error;
  }
}

export { sendAttendanceData };
