import React from 'react';
import { View, Image, StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export default function Header() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Frame 427318921.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30, // da espacio en la parte superior
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.8,       // 80% del ancho
    aspectRatio: 3,           // relación ancho/alto (ajustá según tu imagen)
    maxHeight: 120,           // altura máxima (por si aspectRatio es muy alto)
  },
});
