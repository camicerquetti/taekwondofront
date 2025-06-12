import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, StyleSheet, Dimensions, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import Footer from '../components/footer';

const { width, height } = Dimensions.get('window');

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [serverUrl, setServerUrl] = useState('');

  // Detectar IP correcta según plataforma
  useEffect(() => {
    const baseUrl =
      Platform.OS === 'android'
        ? 'http://181.44.118.209' // emulador Android
        : 'http://localhost:5000'; // iOS simulator o navegador
    setServerUrl(baseUrl);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor, ingrese todos los campos.');
      return;
    }

    const userData = {
      email: username, // El backend espera 'email'
      password: password,
    };

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Inicio de sesión exitoso:', data);
        
        // Guardar el usuario en AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(data.user || data));

        // Verificar el rol del usuario
        const user = data.user || data;
        if (user.role === 'admin') {
          // Si es admin, navegar a 'homeadmin'
          navigation.navigate('homeadmin');
        } else {
          // Si no es admin, navegar a 'home'
          navigation.navigate('home');
        }

      } else {
        Alert.alert('Error', data.message || 'Credenciales incorrectas.');
      }
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert('Error de red', 'No se pudo conectar al servidor.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={styles.formContainer}>
        <Image
          source={require('../assets/images/TaeKwonDo.jpg')}
          style={[styles.banner, { height: height * 0.25 }]}
          resizeMode="contain"
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.resetText}>Restablecer contraseña</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.02,
  },
  banner: {
    width: '100%',
    borderRadius: 10,
    marginBottom: height * 0.05,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
  },
  loginBtn: {
    backgroundColor: '#000',
    padding: height * 0.02,
    borderRadius: 6,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  resetBtn: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    padding: height * 0.02,
    width: width * 0.9,
    alignItems: 'center',
  },
  resetText: {
    color: '#000',
    fontSize: width * 0.04,
  },
});
