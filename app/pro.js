import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SubscriptionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/pro.jpg')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        Este contenido es de pago.{"\n"}Suscribite por $0.99 anual.
      </Text>

      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>Suscribirse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 30,
  },
  subscribeButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 6,
    marginBottom: 15,
  },
  subscribeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    borderColor: '#000',
    borderWidth: 1.5,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 6,
  },
  backText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
