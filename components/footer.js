import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');

export default function Footer() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Frame 427318939 (1).jpg')}
        style={styles.footerLogo}
        resizeMode="contain" // Asegura que la imagen se ajuste sin distorsionarse
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 0,
    paddingHorizontal: 0,  // Aseguramos un padding horizontal adaptable
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  footerLogo: {
    width: '100%', // Ocupa el 100% del ancho de la pantalla
    height: width * 0.2, // Ajustamos la altura en función del ancho de la pantalla (proporcional)
    marginBottom: 8,
  },
});
