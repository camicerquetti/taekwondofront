import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import Footer from '../components/footer'; // importa el footer desde tu carpeta components

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/images/Frame 427318921.jpg')} style={styles.fullLogo} />
        </View>

        <Text style={styles.title}>¿A dónde practicar Taekwon-Do?</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>📍 Mi ubicación</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Buscar por ciudad/dirección</Text>
        </TouchableOpacity>

        <ImageBackground
          source={require('../assets/images/Group 35.jpg')}
          style={styles.map}
        />

        <Text style={styles.footer}>¿Quieres sumar tu dojan?</Text>

        {/* Aquí se inserta el componente Footer */}
        <Footer />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  fullLogo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    marginVertical: 15,
  },
  button: {
    backgroundColor: 'black',
    padding: 12,
    marginHorizontal: 30,
    marginVertical: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  map: {
    height: 200,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  footer: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
});
