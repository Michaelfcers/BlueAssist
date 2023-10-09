import React, { useContext, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UserContext from '../Services/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '../components/alert';
import { sendAttendanceData, isSending } from '../Services/ApiService'; 
import { getLocation } from '../Services/LocationService'; 

import CustomButton from '../components/CustomButton';
import styles from '../components/Styles';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const getDayOfWeek = (date) => DAYS[date.getDay()];

export async function sendPendingData() {
  const pendingData = JSON.parse(await AsyncStorage.getItem('pendingData')) || null;
  if (pendingData && !isSending) { // Utiliza isSending para verificar si se está enviando un registro
    try {
      await AsyncStorage.removeItem('pendingData');
      await sendAttendanceData(pendingData);
    } catch (error) {
      console.error('Error al enviar datos pendientes:', error);
    }
  }
}

const MenuScreen = () => {
  const { user, isDarkMode, setIsDarkMode } = useContext(UserContext);
  
  const [buttonState, setButtonState] = useState({button1: false, button2: true, button3: true, button4: true});
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
    if (isSending) return; // Utiliza isSending para verificar si se está enviando un registro

    const date = new Date();
    const dayOfWeek = getDayOfWeek(date);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const time = date.toLocaleTimeString('en-GB'); // Formato de 24 horas

    const [hora, minutos] = time.split(':').map(Number);

    let diffHours = 0;
    let diffMinutes = 0;

    if (hora >= 18) {
      // Realiza la resta de las horas y minutos
      diffHours = hora - 18;
      diffMinutes = minutos;  // No es necesario ajustar los minutos

      // Convierte los minutos a una fracción de una hora
      const fractionalHours = (diffMinutes / 60).toFixed(2);

      // Toma solo los primeros dos dígitos después del punto decimal
      const fractionalPart = fractionalHours.split('.')[1];

      var extraTime = `${diffHours},${fractionalPart}`;
    }

    const location = await getLocation();
    if (!location) return;

    const coordinates = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;

    const data = {
      cedula: user.cedula,
      fecha: formattedDate,
      dayOfWeek: dayOfWeek,
      hora: time, // Hora en formato de 24 horas
      ubicacion: coordinates,
      type,
      action,
      extraTime
    };
  
    try {
      await sendAttendanceData(data);
      const existingData = await AsyncStorage.getItem('myStoredData');
      const parsedData = existingData ? JSON.parse(existingData) : {};
      const updatedData = { ...parsedData, ...newData };
      for (const key in parsedData) {
        if (parsedData.hasOwnProperty(key)) {
          updatedData[key] = newData.hasOwnProperty(key) ? newData[key] : parsedData[key];
        }
      }
      await AsyncStorage.setItem('myStoredData', JSON.stringify(updatedData));

      // Configura el mensaje de la alerta y muestra la alerta personalizada
      setAlertMessage('¡Se Ha registrado Correctamente su ' + JSON.stringify(newData)+' !');
      setAlertVisible(true);

    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }

    let newState = {...buttonState};
    switch(newData) {
      case 'Registro de Entrada':
        newState = {button1: true, button2: false, button3: false, button4: true};
        break;
      case 'Registro de  Salida':
        newState = {button1: false, button2: true, button3: true, button4: true};
        break;
      case 'Registro de Entrada Visita':
        newState = {button1: true, button2: true, button3: true, button4: false};
        break;
      case 'Registro de Salida Visita':
        newState = {button1: true, button2: false, button3: false, button4: true};
        break;
    }
    setButtonState(newState);
    saveButtonState(newState);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      <CustomButton 
    style={[styles.darkModeButton, { backgroundColor: isDarkMode ? '#333' : '#fff',elevation: 0, }]} 
    onPress={() => setIsDarkMode(prevMode => !prevMode)}
    title={<Icon name={isDarkMode ? 'sun' : 'moon'} size={24} color={isDarkMode ? '#ffffff' : '#000000'} />}
/>

      <View style={styles.categoryContainer}>
          <Text style={[styles.categoryTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Registro de Asistencia</Text>
          <View style={styles.cardContainer}>
              <CustomButton 
                  style={[
                      styles.card, 
                      { backgroundColor: isDarkMode ? '#66c285' : '#32a852' }, 
                      ]} 
                      onPress={() => handlePress('Registro de Asistencia', 'Entrada','Registro de Entrada')} 
                      disabled={buttonState.button1}
                      title={<><View style={{alignItems: 'left', marginLeft: 10}}><Icon name="user-check" size={40} color="#ffffff" /><Text style={styles.cardText}>Entrada</Text></View></>}
                  />
                  <CustomButton 
                      style={[
                          styles.card, 
                          { backgroundColor: isDarkMode ? '#ffad66' : '#ff8c00' }, 
                          buttonState.button2 && styles.disabledButton
                  ]} 
                  onPress={() => handlePress('Registro de Asistencia', 'Salida','Registro de  Salida')} 
                  disabled={buttonState.button2}
                  title={<><View style={{alignItems: 'center'}}><Icon name="user-times" size={40} color="#ffffff" /><Text style={styles.cardText}>Salida</Text></View></>}
              />
          </View>
      </View>
      <View style={styles.categoryContainer}>
          <Text style={[styles.categoryTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Visita Técnica</Text>
          <View style={styles.cardContainer}>
              <CustomButton 
                  style={[
                      styles.card, 
                      { backgroundColor: isDarkMode ? '#66c285' : '#32a852' }, 
                      buttonState.button3 && styles.disabledButton
                  ]} 
                  onPress={() => handlePress('Visita Tecnica', 'Entrada','Registro de Entrada Visita')} 
                  disabled={buttonState.button3}
                  title={<><View style={{alignItems: 'center'}}><Icon name="toolbox" size={40} color="#ffffff" /><Text style={styles.cardText}>Entrada</Text></View></>}
              />
              <CustomButton 
                  style={[
                      styles.card, 
                      { backgroundColor: isDarkMode ? '#ffad66' : '#ff8c00' }, 
                      buttonState.button4 && styles.disabledButton
                  ]} 
                  onPress={() => handlePress('Visita Tecnica', 'Salida','Registro de Salida Visita')} 
                  disabled={buttonState.button4}
                  title={<><View style={{alignItems: 'center'}}><Icon name="truck-loading" size={40} color="#ffffff" /><Text style={styles.cardText}>Salida</Text></View></>}
              />
          </View>
      </View>
      <CustomAlert
          isVisible={isAlertVisible}
          title="Registro Exitoso"
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
      />
      <Text style={[styles.footerText, { color: isDarkMode ? '#fff' : '#333' }]}>
        Copyright © {isDarkMode ? 'Bluelectron' : 'Bluelectron'}
      </Text>
    </View>
  );
};

export default MenuScreen;
