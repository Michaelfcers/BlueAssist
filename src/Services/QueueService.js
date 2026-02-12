import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendAttendanceData } from './AppScriptService';

const QUEUE_KEY = 'offlineQueue';
let isProcessing = false;

const QueueService = {
    // 1. Agregar a la cola (siempre guarda, nunca falla)
    async addToQueue(data) {
        try {
            const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
            const queue = queueJson ? JSON.parse(queueJson) : [];

            // Añadimos timestamp para deburgging
            data._queuedAt = Date.now();

            queue.push(data);
            await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
            console.log('Solicitud guardada en cola. Total pendientes:', queue.length);

            return true;
        } catch (error) {
            console.error('Error guardando en cola:', error);
            return false;
        }
    },

    // 2. Procesar cola (intenta vaciarla)
    async processQueue() {
        if (isProcessing) return;

        try {
            isProcessing = true;
            let queueJson = await AsyncStorage.getItem(QUEUE_KEY);
            let queue = queueJson ? JSON.parse(queueJson) : [];

            if (queue.length === 0) {
                isProcessing = false;
                return;
            }

            console.log('Procesando cola... elemntos:', queue.length);

            // Procesamos UNO por UNO (FIFO)
            // No usamos Promise.all para evitar sobrecargar a Google
            const item = queue[0]; // Tomamos el primero (más viejo)

            try {
                await sendAttendanceData(item, true); // true = isBackground

                // Si tuvo éxito, lo sacamos de la cola
                queue.shift(); // Remove first element
                await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
                console.log('Elemento enviado y removido. Restantes:', queue.length);

                // RECURSIVIDAD: Si quedan más, seguimos procesando inmediatamente
                isProcessing = false; // Liberamos lock temporalmente
                if (queue.length > 0) {
                    this.processQueue();
                }

            } catch (error) {
                // Si es error de concurrencia, simplemente esperamos
                if (error.message === 'SYNC_IN_PROGRESS') {
                    console.log('Sincronización ya en curso (background). Esperando...');
                    isProcessing = false;
                    return;
                }

                console.error('Fallo al enviar elemento de cola:', error);

                // NO lo sacamos de la cola. Lo intentaremos después.
                isProcessing = false;
            }

        } catch (error) {
            console.error('Error procesando cola:', error);
            isProcessing = false;
        }
    },

    // 3. Obtener cantidad pendiente (para UI)
    async getPendingCount() {
        try {
            const queueJson = await AsyncStorage.getItem(QUEUE_KEY);
            const queue = queueJson ? JSON.parse(queueJson) : [];
            return queue.length;
        } catch (error) {
            return 0;
        }
    }
};

export default QueueService;
