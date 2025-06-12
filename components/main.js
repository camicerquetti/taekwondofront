import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Main() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleRegister = () => {
    navigation.navigate('register');
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>
          {/* Título */}
          <Text style={styles.title}>Bienvenido a Taekwon-Do ITF</Text>

          {/* Imagen */}
          <Image 
            source={require('../assets/images/TaeKwonDo.jpg')}
            style={styles.image}
            resizeMode="contain" // Cambié a 'contain' para evitar el recorte en pantallas pequeñas
          />

          {/* Botones */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          {/* Texto debajo de los botones */}
          <Text style={styles.subscriptionText}>
            Versión Gups Free. Suscribite por $0,99 para ver todo el contenido.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.03,
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16, // Añadí un padding para darle un poco de espacio en dispositivos más pequeños
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: height * 0.25,
    marginBottom: height * 0.03,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.1,
    borderRadius: 6,
    marginVertical: height * 0.01,
    width: '80%', // Cambié el width a '80%' para que los botones sean más responsivos
    maxWidth: 320,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: width * 0.035,
  },
  subscriptionText: {
    marginTop: height * 0.03,
    fontSize: width * 0.04,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
