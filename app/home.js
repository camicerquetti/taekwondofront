import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const [userName, setUserName] = useState('');
  const [userPlan, setUserPlan] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.nombre || user.name || '');
          setUserPlan(user.plan || 'basico'); // por defecto 'basico'
        }
      } catch (error) {
        console.error('Error al obtener usuario de AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleNavigation = (routeName) => {
    if (userPlan === 'basico') {
      navigation.navigate('tulesbasic');
    } else {
      navigation.navigate(routeName);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.welcome}>
          Bienvenida {userName || 'Usuario'}
        </Text>

        <Text style={styles.planText}>
          Plan actual: {userPlan === 'pro' ? 'Pro' : 'Básico'}
        </Text>

        {/* Botones convertidos en View para que no sean presionables */}
  <TouchableOpacity
  style={styles.blackButton}
  onPress={() => navigation.navigate('perfil')}
>
  <Text style={styles.buttonText}>Ir a perfil</Text>
</TouchableOpacity>

        {/* Solo la imagen es TouchableOpacity */}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleNavigation('tules')}
        >
          <Image
            source={require('../assets/images/imagen.jpg')}
            style={styles.mainImage}
          />
          <Text style={styles.overlayText}>Repaso de Tules o Formas</Text>
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {['#f5d442', '#fff', '#c5398f', '#5617f1', '#000'].map((color, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>

       <TouchableOpacity
  style={styles.grayButton}
  onPress={() => navigation.navigate('academia')}
>
  <Text style={styles.grayButtonText}>Academia</Text>
</TouchableOpacity>


        <View style={styles.whiteButton}>
          <Text style={styles.whiteButtonText}>
            Explicación y recomendaciones
          </Text>
        </View>

        <View style={styles.doubleImageContainer}>
          <Image
            source={require('../assets/images/Frame 3.jpg')}
            style={styles.sideImage}
          />
          <Image
            source={require('../assets/images/Frame 4.jpg')}
            style={styles.sideImage}
          />
        </View>

        <View style={styles.doubleButtonContainer}>
          <View style={styles.smallBlackButton}>
            <Text style={styles.buttonText}>Movimientos</Text>
          </View>
          <View style={styles.smallBlackButton}>
            <Text style={styles.buttonText}>DO - Filosofía</Text>
          </View>
        </View>

     <TouchableOpacity
  style={styles.blackButton}
  onPress={() => navigation.navigate('dondepracticar')}
>
  <Text style={styles.buttonText}>¿A dónde practicar Taekwon-Do?</Text>
</TouchableOpacity>

      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: width * 0.05,
    alignItems: 'center',
  },
  welcome: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  planText: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#444',
    marginBottom: 20,
  },
  blackButton: {
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: height * 0.02,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: height * 0.3,
    borderRadius: 10,
  },
  overlayText: {
    position: 'absolute',
    top: '40%',
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  grayButton: {
    backgroundColor: '#e0e0e0',
    width: '100%',
    paddingVertical: height * 0.02,
    borderRadius: 6,
    marginTop: 20,
  },
  grayButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  whiteButton: {
    borderWidth: 1,
    borderColor: '#000',
    width: '100%',
    paddingVertical: height * 0.02,
    borderRadius: 6,
    marginVertical: 16,
  },
  whiteButtonText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  doubleImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
  },
  sideImage: {
    width: '48%',
    height: 160,
    borderRadius: 10,
  },
  doubleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    marginBottom: 20,
  },
  smallBlackButton: {
    backgroundColor: '#000',
    width: '48%',
    paddingVertical: height * 0.02,
    borderRadius: 6,
  },
});
