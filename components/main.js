import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  useWindowDimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Platform, Linking } from 'react-native';

const handleEmailPress = () => {
  const email = 'info@taekwondoitfapp.com';
  const subject = 'Consulta';
  const body = 'Hola, tengo una consulta...';

  if (Platform.OS === 'web') {
    // Podés elegir entre Gmail o Outlook (o mostrar un modal con opciones)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank'); // Abrir Gmail en nueva pestaña
  } else {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoUrl);
  }
};



export default function Main() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const handleLogin = () => {
    navigation.navigate('LoginScreen');
  };

  const handleRegister = () => {
    navigation.navigate('register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.mainContainer, { maxWidth: 500 }]}>
          
          {/* Títulos uno debajo del otro */}
          <View style={styles.titlesWrapper}>
            <Text style={[styles.title, { fontSize: width < 300 ? 16 : 18 }]}>
              Taekwon-Do ITF.
            </Text>
            <Text style={[styles.title, { fontSize: width < 300 ? 16 : 18 }]}>
              Repaso rápido de las formas y más
            </Text>
          </View>

          <Image 
            source={require('../assets/images/TaeKwonDo.jpg')}
            style={[styles.image, { width: width,height: height * 0.25 }]}
            resizeMode="cover"
          />

          <TouchableOpacity style={[styles.button, { paddingVertical: 14 }]} onPress={handleLogin}>
            <Text style={[styles.buttonText, { fontSize: 16 }]}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { paddingVertical: 14 }]} onPress={handleRegister}>
            <Text style={[styles.buttonText, { fontSize: 16 }]}>Registrarse</Text>
          </TouchableOpacity>
<View style={{ alignItems: 'center' }}>
  <Text style={styles.subscriptionText}>
       Versión de Testeo.
  </Text>
<Text style={styles.subscriptionText}>
   Aplicación de uso libre y en etapa de prueba. No es oficial, solo para uso privado. Cualquier duda comunicarse a{' '}
  <Text
    style={[styles.subscriptionText, { color: 'blue', textDecorationLine: 'underline' }]}
    onPress={handleEmailPress}
  >
    info@taekwondoitfapp.com
  </Text>
</Text>



</View>

          
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
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  titlesWrapper: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  image: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 6,
    marginVertical: 10,
    width: '80%',
    maxWidth: 320,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  subscriptionText: {
    fontFamily: 'Poppins_500Medium', // nombre exacto de la fuente cargada
    fontWeight: '500',
    fontStyle: 'normal',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.3, // 3% de 10px
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
