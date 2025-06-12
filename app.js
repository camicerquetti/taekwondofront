import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Mi Aplicación</Text>
      </View>
      
      {/* Contenido principal */}
      <View style={styles.mainContainer}>
        <Text style={styles.mainText}>Bienvenido a la pantalla principal</Text>
      </View>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Derechos Reservados © 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',  // Asegura que el Header y Footer estén al principio y final
    backgroundColor: '#f4f4f4',  // Color de fondo general, puedes cambiarlo
  },
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 24,
  },
  footerContainer: {
    padding: 10,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
  },
});
