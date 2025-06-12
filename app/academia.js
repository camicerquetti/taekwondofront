import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PrincipioScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/Frame 427318921.jpg')}
          style={styles.logo}
        />
      </View>

      {/* Imagen o video central (placeholder negro) */}
      <View style={styles.mediaContainer}>
        <View style={styles.videoPlaceholder} />
      </View>

      {/* Título y texto */}
      <Text style={styles.title}>
        Principio del Taekwon-Do por el GM Marano.
      </Text>

      <Text style={styles.text}>
        "On the other hand, we denounce with righteous indignation and dislike men who are so
        beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire,
        that they cannot foresee the pain and trouble that are bound to ensue; and equal blame
        belongs to those who fail in their duty through weakness of will, which is the same as
        saying through shrinking from toil and pain. These cases are perfectly simple and easy to
        distinguish. In a free hour, when our power of choice is untrammelled and when nothing
        prevents our being able to do what we like best, every pleasure is to be welcomed and every
        pain avoided. But in certain circumstances and owing to the claims of duty or the
        obligations of business it will frequently occur that pleasures have to be repudiated and
        annoyances accepted. The wise man therefore always holds in these matters to this principle
        of selection: he rejects pleasures to secure other greater pleasures, or else he endures
        pains to avoid worse pains."
      </Text>

      {/* Botones */}
      <TouchableOpacity style={styles.buttonBlack} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBlack} onPress={() => navigation.navigate('continuaracademia')}>
  <Text style={styles.buttonText}>Siguiente contenido</Text>
</TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
  },
  mediaContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#000',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'left',
    width: '100%',
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 24,
  },
  buttonBlack: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
