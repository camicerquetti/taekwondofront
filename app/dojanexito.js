// screens/DojanExito.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function DojanExito({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>¡Solicitud recibida!</Text>
      <Text style={styles.mensaje}>
        Hemos recibido la solicitud de registro de tu dojan. 
        En breve te notificaremos al correo electrónico el estado de tu solicitud.
      </Text>
      <TouchableOpacity
        style={styles.boton}
        onPress={() => navigation.navigate('Home')} // Cambiá 'Home' por la pantalla que corresponda
      >
        <Text style={styles.textoBoton}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  mensaje: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#444',
  },
  boton: {
    backgroundColor: '#000', // Botón negro
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
  },
});
