import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footerWrapper}>
      <View style={styles.blackLine} />

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image
            source={require('../assets/images/itf-logo.svg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.textContent}>
            <Text style={styles.mainText}>
              Plataforma basada en editoriales de Fabián Izquierdo y la enciclopedia del Taekwon-Do.
            </Text>
          </View>
        </View>

        <View style={styles.bottomTextContainer}>
          <Text style={styles.subText}>
            Thinking with <Text style={styles.boldText}>Mindcircus Agency.</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  blackLine: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
    marginTop: 25,
  },
  container: {
    paddingVertical: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  innerContainer: {
    width: 340,
    height: 53.088, // Fijo según lo pedido
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Solo en web. En móvil lo simulamos abajo
  },
  logo: {
    width: 90,
    height: 55,
    marginRight: 20, // Simula el gap entre logo y texto
  },
  textContent: {
    flex: 1,
  },
  mainText: {
    fontSize: 10.5,
    color: '#000',
    lineHeight: 16,
    flexShrink: 1,
    opacity: 1,
  },
  bottomTextContainer: {
    width: 340,
    height: 16,
    marginTop: 8,
    opacity: 1,
  },
  subText: {
    fontSize: 11,
    color: '#888',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000',
  },
});
