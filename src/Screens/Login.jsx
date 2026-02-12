import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Text, Alert, Image, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

import UserContext from '../Services/UserContext';
import GoogleSheetsManager from '../Services/GoogleSheetsManager';
import styles from '../components/StyleLogin';
import CustomButton from '../components/CustomButton';

const Login = ({ onLoginSuccess }) => {
  const { setUser } = useContext(UserContext);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      Alert.alert('Campos vacíos', 'Por favor ingresa tu cédula y contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      const googleSheetsManager = new GoogleSheetsManager();
      const sheetData = await googleSheetsManager.fetchSheetData('Trabajadores!A2:C');

      if (!Array.isArray(sheetData) || sheetData.length === 0) {
        Alert.alert('Error', 'Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo más tarde.');
        return;
      }

      const user = sheetData.find((user) => user[0] === credentials.username && user[1] === credentials.password);

      if (user) {
        const userData = { cedula: user[0], nombre: user[2] || 'Usuario' };

        setUser({ ...userData, password: user[1] }); // Keep password in memory for current session only
        onLoginSuccess();
        AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        Alert.alert('Acceso denegado', 'Cédula o clave incorrectos');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión. Verifica tu internet.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          onLoginSuccess();
        }
      } catch (error) {/* Silent fail */ }
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#32a852" />
      <View style={styles.topDecor} />

      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.logoWrapper}>
            <Image
              style={styles.logo}
              source={require('../components/assets/bluelectronazu.png')}
            />
          </View>

          <Text style={styles.appName}>BlueAssist</Text>
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>Ingresa tus credenciales para continuar</Text>

          <View style={styles.inputContainer}>
            <Icon name="id-card" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Cédula"
              placeholderTextColor="#aaa"
              onChangeText={(text) => setCredentials(prevState => ({ ...prevState, username: text }))}
              value={credentials.username}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              onChangeText={(text) => setCredentials(prevState => ({ ...prevState, password: text }))}
              value={credentials.password}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title={isLoading ? "Verificando..." : "Iniciar Sesión"}
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>{isLoading ? "Verificando..." : "Iniciar Sesión"}</Text>
            </CustomButton>
          </View>

          <TouchableOpacity style={styles.forgotPassword} onPress={() => Alert.alert('Información', 'Contacta al administrador para restablecer tu contraseña.')}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
