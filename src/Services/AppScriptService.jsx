import AsyncStorage from '@react-native-async-storage/async-storage';

let isSending = false; // Crea una variable isSending en lugar de una función

async function sendAttendanceData(data) {
  if (isSending) return; // Comprueba si isSending es verdadero sin llamarlo como una función
  try {
    isSending = true; // Establece isSending en true antes de enviar los datos
    const response = await fetch(process.env.EXPO_PUBLIC_GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    // console.log(result); // Security: Removed sensitive log
    if (result.result === 'error' && result.message === 'Registro duplicado') {
      throw new Error('Registro duplicado');
    }
  } catch (error) {
    console.error('Hubo un error:', error);
    await AsyncStorage.setItem('pendingData', JSON.stringify(data));
  } finally {
    isSending = false; // Establece isSending en false después de enviar los datos
  }
}

export { sendAttendanceData, isSending }; // Exporta isSending como una variable
