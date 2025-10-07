import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/header';
import Footer from '../components/footer';

export default function ResetPasswordNewPassword() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setMensaje({ tipo: 'error', texto: 'El email es obligatorio.' });
      return;
    }

    if (!validateEmail(email)) {
      setMensaje({ tipo: 'error', texto: 'El email no es válido.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMensaje({ tipo: 'error', texto: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      const response = await fetch('https://taekwondoitfapp.com/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          nuevaClave: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje({ tipo: 'exito', texto: 'Contraseña actualizada correctamente.' });
        navigation.navigate('Success'); // Asegurate que exista esa ruta
      } else {
        setMensaje({ tipo: 'error', texto: data.message || 'No se pudo actualizar la contraseña.' });
      }
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
      setMensaje({ tipo: 'error', texto: 'Error al conectar con el servidor.' });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../assets/images/TaeKwonDo.jpg')} style={styles.image} resizeMode="contain" />

        <Text style={styles.title}>Reseteá contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Ingresar la nueva contraseña"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Repetir la nueva contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {mensaje && (
          <View
            style={[
              styles.messageBox,
              mensaje.tipo === 'error' ? styles.errorBox : styles.successBox,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                mensaje.tipo === 'error' ? styles.errorText : styles.successText,
              ]}
            >
              {mensaje.texto}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={[styles.button, { backgroundColor: 'black', marginTop: 10}]}
  onPress={() => navigation.navigate('LoginScreen')}
>
  <Text style={[styles.buttonText, { color: 'white' }]}>Login</Text>
</TouchableOpacity>

      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  image: {
    width: Dimensions.get('window').width - 40, // Para ocupar todo el ancho menos el padding
    height: 220,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: 'withe',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  messageBox: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: '100%',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#721c24',
  },
  successText: {
    color: '#155724',
  },
});
