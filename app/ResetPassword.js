import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header';
import Footer from '../components/footer';

const { width, height } = Dimensions.get('window');

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      console.log('Enviando solicitud a /reset-password con:', email);

      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      console.log('Respuesta del backend:', response.status, data);

      if (response.ok) {
        navigation.navigate('ResetConfirmationScreen');
      } else {
        Alert.alert('Error', data.message || 'No se pudo enviar el correo.');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      Alert.alert('Error', `No se pudo conectar al servidor: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <Image
        source={require('../assets/images/TaeKwonDo.jpg')}
        style={[styles.banner, { height: height * 0.25 }]}
        resizeMode="cover"
      />

      <View style={styles.formContainer}>
        <Text style={styles.header}>Resetea tu contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleResetPassword}
        >
          <Text style={styles.resetText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  header: {
    fontSize: height * 0.04,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: height * 0.02,
  },
  resetBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 6,
    width: width * 0.9,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
