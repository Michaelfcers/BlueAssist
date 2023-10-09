import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../Services/UserContext';
import GoogleSheetsManager from '../Services/GoogleSheetsManager';
import styles from '../components/StyleLogin'; // Importa los estilos desde el archivo styles.js

const Login = ({ onLoginSuccess }) => {
  const { setUser } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    const googleSheetsManager = new GoogleSheetsManager();
    const sheetData = await googleSheetsManager.fetchSheetData('Trabajadores!A2:B');

    if (!Array.isArray(sheetData) || sheetData.length === 0) {
      Alert.alert('Error', 'Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo más tarde.');
      return;
    }

    const user = sheetData.find((user) => user[0] === credentials.username && user[1] === credentials.password);

    if (user) {
      const userData = { cedula: user[0], password: user[1] };
      setUser(userData);
      onLoginSuccess();
      AsyncStorage.setItem('user', JSON.stringify(userData));
    } else {
      Alert.alert('Error', 'Cédula o clave incorrectos');
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        onLoginSuccess();
      }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../components/assets/bluelectronazu.png')}
      />
      <Text style={styles.title}>Bienvenido</Text>
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        onChangeText={(text) => setCredentials(prevState => ({ ...prevState, username: text }))}
        value={credentials.username}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={(text) => setCredentials(prevState => ({ ...prevState, password: text }))}
        value={credentials.password}
      />
      <View style={styles.buttonContainer}>
        <Button title="Iniciar sesión" color="#32a852" onPress={handleLogin} />
      </View>
    </View>
  );
};

export default Login;
