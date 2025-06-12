import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header';  // Asegúrate de que la ruta sea correcta
import Footer from '../components/footer';  // Asegúrate de que la ruta sea correcta

const { width, height } = Dimensions.get('window');

export default function ResetConfirmationScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Incluir el Header en la parte superior */}
      <Header />

      {/* Imagen en la parte superior */}
      <Image
        source={require('../assets/images/TaeKwonDo.jpg')} // Ruta de tu imagen
        style={[styles.banner, { height: height * 0.25 }]} // Ajuste dinámico para la imagen
        resizeMode="cover"
      />

      <View style={styles.formContainer}>
        {/* Título */}
        <Text style={styles.header}>¡Correo enviado!</Text>

        {/* Mensaje de confirmación */}
        <Text style={styles.message}>
          Te hemos enviado un mail para continuar con el proceso para restablecer tu contraseña.
        </Text>

        {/* Botón para volver a la pantalla de login */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.navigate('LoginScreen')} // Redirige a la pantalla LoginScreen
        >
          <Text style={styles.continueText}>Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Incluir el Footer al final */}
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
  message: {
    fontSize: height * 0.02,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 6,
    width: width * 0.9,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
