import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Header() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={[styles.safeArea, { paddingHorizontal: width * 0.05, height: height * 0.13 }]}>
      <View style={[styles.container, { justifyContent: 'flex-start' }]}>
        {/* Logo izquierda como botón */}
     <TouchableOpacity
  onPress={async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData); // parseamos el objeto
        // Redirige según el rol
        if (user.role === 'admin') {
          navigation.navigate('homeadmin');
        } else {
          navigation.navigate('home');
        }
      } else {
        navigation.navigate('LoginScreen');
      }
    } catch (error) {
      console.log("Error verificando sesión:", error);
      navigation.navigate('LoginScreen'); // fallback
    }
  }}
  style={[styles.logoLeftTouchable, { width: width * 0.3, height: height * 0.1, marginLeft: 30 }]}
  activeOpacity={0.7}
>
          <Image
            source={require('../assets/images/itf-logo.svg')}
            style={styles.logoLeft}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Espacio pequeño entre logos */}
        <View style={{ width: 5 }} />  {/* Espacio reducido */}

        {/* Logo derecha como botón */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={[styles.logoRightTouchable, { width: width * 0.5, height: height * 0.12 }]}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/images/gnt-logo.svg')}
            style={styles.logoRight}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    opacity: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logoLeftTouchable: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoLeft: {
    width: '100%',
    height: '100%',
  },
  logoRightTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRight: {
    width: '100%',
    height: '100%',
  },
});
