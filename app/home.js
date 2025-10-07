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
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.nombre || user.name || '');
          setUserPlan(user.plan || 'basico');
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

        <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('perfil')}>
          <Text style={styles.buttonText}>Ir a perfil</Text>
        </TouchableOpacity>

        {/* Imagen principal con overlay y círculos de colores encima */}
        <TouchableOpacity style={styles.imageContainer} onPress={() => handleNavigation('tules')}>
          <Image
            source={require('../assets/images/imagen.jpg')}
            style={styles.mainImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
          <Text style={styles.overlayText}>Repaso de Tules o Formas</Text>

          <View style={styles.dotsContainer}>
            {['#fff', '#f5d442', '#33cc33', '#5617f1', 'red', '#000'].map((color, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: color }]} />
            ))}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => {
            console.log('User Plan:', userPlan);
            navigation.navigate('continuaracademia', { plan: userPlan });
          }}
        >
          <Text style={styles.buttonText}>Academia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.whiteButton}
          onPress={() => navigation.navigate('introduccion')}
        >
          <Text style={styles.whiteButtonText}>Explicación y recomendaciones</Text>
        </TouchableOpacity>

        <View style={styles.doubleImageContainer}>
          <Image source={require('../assets/images/Frame 3.jpg')} style={styles.sideImage} />
          <Image source={require('../assets/images/Frame 4.jpg')} style={styles.sideImage} />
        </View>

        <View style={styles.doubleButtonContainer}>
          <TouchableOpacity
            style={styles.smallBlackButton}
            onPress={() => navigation.navigate('movimiento')}
          >
            <Text style={styles.buttonText}>Movimientos Fundamentales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallBlackButton}
            onPress={() => navigation.navigate('do')}
          >
            <Text style={styles.buttonText}>DO - Filosofía</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => navigation.navigate('dondepracticar')}
        >
          <Text style={styles.buttonText}>¿A dónde practicar Taekwon-Do?</Text>
        </TouchableOpacity>
        <Footer />
      </ScrollView>
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
    marginBottom: 30,
    marginTop: 20,
    height: 180,
    borderRadius: 5,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayText: {
    position: 'absolute',
    top: '40%',
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  dotsContainer: {
    position: 'absolute',
    top: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
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
    resizeMode: 'contain',
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
