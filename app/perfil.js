import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import Header from '../components/header'; // Asegurate de que esta ruta sea correcta
import Footer from '../components/footer';
const handleNavigation = (screenName) => {
  navigation.navigate(screenName);
};


const MiPerfilScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

      {/* Logos */}
      <View style={styles.logosContainer}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/ITF_Logo.svg' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/150x60?text=Grupo+Norte' }} // Reemplaza con el logo real
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Botones principales */}
 <TouchableOpacity
  style={styles.button}
   onPress={() => handleNavigation('perfiledit')}
>
  <Text style={styles.buttonText}>Editar perfil</Text>
</TouchableOpacity>


      <TouchableOpacity style={styles.button}
      onPress={() => handleNavigation('instructor')}>
        <Text style={styles.buttonText}>Mi instructor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}
      onPress={() => handleNavigation('midojan')}>
        <Text style={styles.buttonText}>Mi Dojan / escuela</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}
        onPress={() => handleNavigation('plan')}>Mi plan</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blackButton}         onPress={() => handleNavigation('home')}>
        <Text style={styles.blackButtonText} >Volver</Text>
      </TouchableOpacity>

      {/* Footer personalizado */}
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 30,
  },
  logo: {
    width: 140,
    height: 60,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#000',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  blackButton: {
    width: '100%',
    paddingVertical: 14,
    marginTop: 20,
    backgroundColor: '#000',
    borderRadius: 6,
    alignItems: 'center',
  },
  blackButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MiPerfilScreen;
