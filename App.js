import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import UserContext from './src/Services/UserContext';
import Login from './src/Screens/Login';
import QueueService from './src/Services/QueueService';
import { startLocationTracking } from './src/Services/LocationService';
import MenuScreen from './src/Screens/MenuScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para el modo oscuro

  const handleLoginSuccess = () => setIsLoggedIn(true);

  useEffect(() => {
    // Intentar procesar cola y encender GPS
    QueueService.processQueue();
    startLocationTracking();

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        console.log("Internet detectado: Procesando cola...");
        QueueService.processQueue();
      }
    });

    return () => unsubscribeNetInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isDarkMode, setIsDarkMode, isLoggedIn, setIsLoggedIn }}>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
        <StatusBar style="auto" />
        {isLoggedIn ? <MenuScreen /> : <Login onLoginSuccess={handleLoginSuccess} />}
      </View>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
