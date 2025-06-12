import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Header from '../../components/header';  // Asegúrate de que la ruta sea correcta
import Footer from '../../components/footer';  // Asegúrate de que la ruta sea correcta
import Main from '../../components/main';  // Asegúrate de que la ruta sea correcta

// Obtenemos las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
      </View>

      <View style={styles.main}>
        <Main />
      </View>

      <View style={styles.footer}>
        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4', // Color de fondo general
  },
  header: {
    height: height * 0.1, // 10% de la altura de la pantalla
    justifyContent: 'center', // Centra el contenido dentro del Header
    paddingHorizontal: 15, // Padding horizontal para el Header
  },
  main: {
    flex: 1, // Esto hace que Main ocupe todo el espacio restante
    padding: 10, // Espaciado alrededor del contenido principal
  },
  footer: {
    height: height * 0.08, // 8% de la altura de la pantalla para el Footer
    justifyContent: 'center', // Centra el contenido dentro del Footer
    paddingHorizontal: 15, // Padding horizontal para el Footer
  },
});
