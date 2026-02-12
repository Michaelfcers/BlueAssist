import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StatusBar, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UserContext from '../Services/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/alert';
import { getLocation } from '../Services/LocationService';
import QueueService from '../Services/QueueService';

import CustomButton from '../components/CustomButton';
import styles from '../components/Styles';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getDayOfWeek = (date) => DAYS[date.getDay()];

export async function sendPendingData() {
  const pendingData = JSON.parse(await AsyncStorage.getItem('pendingData')) || null;
  if (pendingData && !isSending) {
    try {
      await AsyncStorage.removeItem('pendingData');
      await sendAttendanceData(pendingData);
    } catch (error) {
      console.error('Error al enviar datos pendientes:', error);
    }
  }
}

const MenuScreen = () => {
  const { user, isDarkMode, setIsDarkMode, setIsLoggedIn } = useContext(UserContext);

  const [buttonState, setButtonState] = useState({ button1: false, button2: true, button3: true, button4: true });
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Colors based on mode
  const backgroundColor = isDarkMode ? '#121212' : '#F7F8FA';
  const textColor = isDarkMode ? '#ffffff' : '#333333';
  const cardEntryColor = isDarkMode ? '#2ecc71' : '#4CAF50'; // Vibrant green
  const cardExitColor = isDarkMode ? '#e67e22' : '#FF9800'; // Vibrant orange
  const iconColor = '#ffffff';

  const toggleProfileModal = () => {
    setProfileModalVisible(!isProfileModalVisible);
  };

  const handleLogout = async () => {
    try {
      // FORCEFUL CLEANUP
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('buttonState');
      await AsyncStorage.removeItem('myStoredData'); // Clean cached form data too logic
      setProfileModalVisible(false);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };

  const handleResetApp = async () => {
    try {
      await AsyncStorage.clear(); // NIVEL NUCLEAR: Borra todo
      alert("Datos borrados. La app se cerrará o reiniciará.");
      setIsLoggedIn(false);
    } catch (e) {
      alert("Error borrando datos");
    }
  };

  useEffect(() => {
    const checkTimeAndResetButtons = () => {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();

      if (currentHour >= 3 && currentHour < 4) {
        const defaultState = {
          button1: false,
          button2: true,
          button3: true,
          button4: true
        };
        setButtonState(defaultState);
        saveButtonState(defaultState);
      }
    };

    checkTimeAndResetButtons();
    const intervalId = setInterval(checkTimeAndResetButtons, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadButtonState = async () => {
      try {
        const storedData = await AsyncStorage.getItem('buttonState');
        if (storedData) {
          setButtonState(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error al cargar el estado de los botones:', error);
      }
    };
    loadButtonState();
  }, []);

  const saveButtonState = async (newState) => {
    try {
      await AsyncStorage.setItem('buttonState', JSON.stringify(newState));
    } catch (error) {
      console.error('Error al guardar el estado de los botones:', error);
    }
  };

  const handlePress = async (type, action, newData) => {
    // ELIMINADO: if (isLoading) return;  <-- CAUSA DE BLOQUEO SILENCIOSO
    // setIsLoading(true); <-- YA NO BLOQUEAMOS LA UI CON SPINNER

    // 1. OBTENER FECHA Y HORA (Instantáneo)
    const date = new Date();
    const dayOfWeek = getDayOfWeek(date);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const time = date.toLocaleTimeString('en-GB');

    const [hora, minutos] = time.split(':').map(Number);
    let extraTime;

    if (hora >= 18) {
      const diffHours = hora - 18;
      const fractionalHours = (minutos / 60).toFixed(2);
      const fractionalPart = fractionalHours.split('.')[1];
      extraTime = `${diffHours},${fractionalPart}`;
    }

    try {
      // 2. OBTENER UBICACIÓN (Instantánea gracias al Tracking en App.js)
      let coordinates = "Pendiente de GPS";
      try {
        const location = await getLocation();
        if (location) {
          coordinates = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
        }
      } catch (locError) {
        console.warn("No se pudo obtener ubicación:", locError);
      }

      const data = {
        cedula: user.cedula,
        nombre: user.nombre || 'Desconocido',
        fecha: formattedDate,
        dayOfWeek: dayOfWeek,
        hora: time,
        ubicacion: coordinates,
        type,
        action,
        extraTime
      };

      // 3. GUARDAR EN COLA (Instantáneo - Fire & Forget)
      await QueueService.addToQueue(data);

      // 4. ACTUALIZAR UI (Instantáneo)
      const existingData = await AsyncStorage.getItem('myStoredData');
      const parsedData = existingData ? JSON.parse(existingData) : {};
      const updatedData = { ...parsedData, ...newData };

      // Merge logic
      for (const key in parsedData) {
        if (parsedData.hasOwnProperty(key)) {
          updatedData[key] = newData.hasOwnProperty(key) ? newData[key] : parsedData[key];
        }
      }
      await AsyncStorage.setItem('myStoredData', JSON.stringify(updatedData));

      // ACTUALIZAR ESTADO DE BOTONES
      let newState = { ...buttonState };

      // Normalizamos la entrada para asegurar coincidencia
      const actionType = newData.trim();

      switch (actionType) {
        case 'Registro de Entrada':
          newState = { button1: true, button2: false, button3: false, button4: true };
          break;
        case 'Registro de  Salida': // Nota: El string original tiene doble espacio, lo mantenemos o corregimos en el botón
        case 'Registro de Salida':
          newState = { button1: false, button2: true, button3: true, button4: true };
          break;
        case 'Registro de Entrada Visita':
          newState = { button1: true, button2: true, button3: true, button4: false };
          break;
        case 'Registro de Salida Visita':
          newState = { button1: true, button2: false, button3: false, button4: true };
          break;
        default:
          console.warn("Acción no reconocida para actualizar botones:", actionType);
      }
      setButtonState(newState);
      saveButtonState(newState);

      setAlertMessage(`¡Registro Guardado! Se sincronizará en breve.`);
      setAlertVisible(true);

      // 5. INICIAR SINCRONIZACIÓN EN SEGUNDO PLANO
      // Usamos setTimeout para romper la cadena de promesas y que no afecte la UI
      setTimeout(() => {
        QueueService.processQueue();
      }, 500);

    } catch (error) {
      console.error('Error crítico al guardar en cola:', error);
      alert(`Error Crítico: ${error.message}`); // Usamos Alert nativo por seguridad
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundColor} />

      {/* Loading Overlay */}
      {isLoading && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
          justifyContent: 'center', alignItems: 'center'
        }}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={{ color: 'white', marginTop: 10, fontWeight: 'bold' }}>Registrando en Google...</Text>
        </View>
      )}

      {/* Profile Button (Left) */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={toggleProfileModal}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Icon name="user-alt" size={22} color="#4A4A4A" />
      </TouchableOpacity>

      {/* Dark Mode Toggle (Right) */}
      <TouchableOpacity
        style={styles.themeToggleButton}
        onPress={() => setIsDarkMode(prevMode => !prevMode)}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Icon name={isDarkMode ? 'sun' : 'moon'} size={26} color={isDarkMode ? '#FF8C00' : '#4A4A4A'} />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={[styles.categoryTitle, { fontSize: 28, marginBottom: 5, color: textColor }]}>Hola, {user.nombre || 'Usuario'}</Text>
        <Text style={{ color: isDarkMode ? '#bbb' : '#777', fontSize: 16 }}>Bienvenido de nuevo</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', width: '100%' }}>
        {/* Asistencia Section */}
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryTitle, { color: textColor }]}>Registro de Asistencia</Text>
          <View style={styles.cardContainer}>
            <CustomButton
              style={[styles.card, { backgroundColor: cardEntryColor }]}
              onPress={() => handlePress('Registro de Asistencia', 'Entrada', 'Registro de Entrada')}
              disabled={buttonState.button1 || isLoading}
            >
              <View style={styles.iconContainer}>
                <Icon name="user-check" size={45} color={iconColor} />
              </View>
              <Text style={styles.cardText}>Entrada</Text>
            </CustomButton>

            <CustomButton
              style={[styles.card, { backgroundColor: cardExitColor }, buttonState.button2 && styles.disabledButton]}
              onPress={() => handlePress('Registro de Asistencia', 'Salida', 'Registro de  Salida')}
              disabled={buttonState.button2 || isLoading}
            >
              <View style={styles.iconContainer}>
                <Icon name="user-times" size={45} color={iconColor} />
              </View>
              <Text style={styles.cardText}>Salida</Text>
            </CustomButton>
          </View>
        </View>

        {/* Visita Técnica Section */}
        <View style={styles.categoryContainer}>
          <Text style={[styles.categoryTitle, { color: textColor }]}>Visita Técnica</Text>
          <View style={styles.cardContainer}>
            <CustomButton
              style={[styles.card, { backgroundColor: cardEntryColor }, buttonState.button3 && styles.disabledButton]}
              onPress={() => handlePress('Visita Tecnica', 'Entrada', 'Registro de Entrada Visita')}
              disabled={buttonState.button3 || isLoading}
            >
              <View style={styles.iconContainer}>
                <Icon name="toolbox" size={45} color={iconColor} />
              </View>
              <Text style={styles.cardText}>Entrada</Text>
            </CustomButton>

            <CustomButton
              style={[styles.card, { backgroundColor: cardExitColor }, buttonState.button4 && styles.disabledButton]}
              onPress={() => handlePress('Visita Tecnica', 'Salida', 'Registro de Salida Visita')}
              disabled={buttonState.button4 || isLoading}
            >
              <View style={styles.iconContainer}>
                <Icon name="truck-loading" size={45} color={iconColor} />
              </View>
              <Text style={styles.cardText}>Salida</Text>
            </CustomButton>
          </View>
        </View>
      </View>

      <CustomAlert
        isVisible={isAlertVisible}
        title="Registro Exitoso"
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />

      {/* Account Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isProfileModalVisible}
        onRequestClose={toggleProfileModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mi Cuenta</Text>

            <View style={styles.modalInfoContainer}>
              <Text style={styles.modalLabel}>Nombre</Text>
              <Text style={styles.modalValue}>{user.nombre || 'Usuario'}</Text>

              <Text style={styles.modalLabel}>Cédula</Text>
              <Text style={styles.modalValue}>{user.cedula || '---'}</Text>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: 'red', marginTop: 10, borderColor: 'red' }]}
              onPress={handleResetApp}
            >
              <Text style={styles.closeButtonText}>⚠️ REINICIAR APP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleProfileModal}
            >
              <Text style={styles.closeButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={[styles.footerText, { color: isDarkMode ? '#fff' : '#333' }]}>
        Copyright © {new Date().getFullYear()} Bluelectron
      </Text>
    </View>
  );
};

export default MenuScreen;
