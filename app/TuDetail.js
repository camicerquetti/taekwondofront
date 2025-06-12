import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Asegúrate de tener esta librería instalada

const tulDescriptions = {
  'Chon-Ji': {
    movimientos: 19,
    significado: 'Significa literalmente “Cielo-Tierra”',
    descripcion:
      'Se interpreta, en Oriente, como la creación del mundo o el comienzo de la Historia, es decir, corresponde al Tul inicial realizado por el principiante.\n\nEste tul consiste en dos partes similares: Una representa el Cielo y la otra, la Tierra.'
  }
  // Puedes añadir más tules aquí
};

const TulDetail = ({ route }) => {
  const { tul } = route.params;
  const info = tulDescriptions[tul.name] || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{tul.name}</Text>

      {/* Círculos + flecha */}
      <View style={styles.colorRow}>
        {tul.colors.map((color, index) => (
          <React.Fragment key={index}>
            <View style={[styles.circle, { backgroundColor: color }]} />
            {index === 1 && <Text style={styles.arrow}>›</Text>}
          </React.Fragment>
        ))}
      </View>

      {/* Movimientos */}
      <Text style={styles.mov}>{info.movimientos} movimientos</Text>

      {/* Significado */}
      <Text style={styles.bold}>{info.significado}</Text>

      {/* Descripción separada en párrafos */}
      {info.descripcion.split('\n\n').map((p, index) => (
        <Text key={index} style={styles.desc}>
          {p}
        </Text>
      ))}

      {/* Botones */}
      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startText}>Iniciar</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.planPro}>
          <FontAwesome name="tree" size={16} color="black" style={{ marginRight: 5 }} />
          <Text style={styles.planText}>Plan Pro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.theoryButton}>
          <Text style={styles.theoryText}>Teoría</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    flex: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8
  },
  arrow: {
    fontSize: 18,
    marginRight: 8
  },
  mov: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600'
  },
  bold: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold'
  },
  desc: {
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22
  },
  startButton: {
    marginTop: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 8
  },
  startText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  planPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFFFE2',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center'
  },
  planText: {
    fontWeight: 'bold'
  },
  theoryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  theoryText: {
    fontWeight: 'bold'
  }
});

export default TulDetail;
