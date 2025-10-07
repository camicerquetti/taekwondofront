import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import Footer from '../components/footer';

export default function MiPerfilScreen() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        }
      } catch (error) {
        console.log('Error obteniendo usuario:', error);
      }
    };
    fetchUser();
  }, []);

  const handleNavigation = (screenName) => {
    if (screenName === 'perfiledit' && !userId) {
      alert('No se pudo obtener el usuario');
      return;
    }
    navigation.navigate(screenName, { userId });
  };
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('user'); // Borra los datos
    navigation.reset({                      // Resetea el stack de navegación
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  } catch (error) {
    console.log('Error al cerrar sesión:', error);
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

      <View style={styles.logosContainer}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/ITF_Logo.svg' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Image
          source={{ uri: 'https://via.placeholder.com/150x60?text=Grupo+Norte' }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('perfiledit')}>
        <Text style={styles.buttonText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('instructor')}>
        <Text style={styles.buttonText}>Mi instructor</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('midojan')}>
        <Text style={styles.buttonText}>Mi Dojang / escuela</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation('plan')}>
        <Text style={styles.buttonText}>Mi plan</Text>
      </TouchableOpacity>

      {/* Cerrar sesión */}
      <TouchableOpacity style={styles.blackButton} onPress={handleLogout}>
        <Text style={styles.blackButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blackButton} onPress={() => handleNavigation('home')}>
        <Text style={styles.blackButtonText}>Volver</Text>
      </TouchableOpacity>

      <Footer />
    </ScrollView>
  );
}

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
