import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import Footer from '../components/footer';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const baseUrl =
      Platform.OS === 'android'
        ? 'https://taekwondoitfapp.com'
        : 'https://taekwondoitfapp.com';
    setServerUrl(baseUrl);
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      const msg = 'Por favor, ingrese todos los campos.';
      setErrorMessage(msg);
      Alert.alert('Error', msg);
      return;
    }

    const userData = {
      email: username.trim(),
      password: password.trim(),
    };

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Respuesta del backend:', data);

      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user || data));
        setErrorMessage('');
        const user = data.user || data;
        if (user.role === 'admin') {
          navigation.navigate('homeadmin');
        } else {
          navigation.navigate('home');
        }
      } else {
        const msg = data.message || 'Credenciales incorrectas.';
        setErrorMessage(msg);
        Alert.alert('Error', msg);
      }
    } catch (error) {
      console.error('Error de red:', error);
      const msg = 'No se pudo conectar al servidor.';
      setErrorMessage(msg);
      Alert.alert('Error de red', msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Header />

        {/* Título arriba de la imagen */}
        <Text style={styles.title}>Iniciar sesión</Text>

        <Image
          source={require('../assets/images/TaeKwonDo.jpg')}
          style={styles.banner}
          resizeMode="cover"
        />

        <View style={styles.formContainer}>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Username"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            textContentType="username"
            autoComplete="username"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            textContentType="password"
            autoComplete="password"
          />

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    width: '90%',
    maxWidth: 350,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 0, // sin bordes redondeados para que ocupe todo
  },
  formContainer: {
    width: '90%',
    maxWidth: 350,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  loginBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetBtn: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  resetText: {
    color: '#000',
    fontSize: 14,
  },
  errorText: {
    width: '100%',
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
