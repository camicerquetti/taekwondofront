import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [tuls, setTuls] = useState([]);
  const [loadingTuls, setLoadingTuls] = useState(true);
  const [selectedTul, setSelectedTul] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [tulDetails, setTulDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/tules')
      .then(res => res.json())
      .then(data => {
        const groupTuls = data.filter(tul => tul.nivel === 'gup');
        setTuls(groupTuls);
        setLoadingTuls(false);
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudieron cargar los tuls');
        setLoadingTuls(false);
      });
  }, []);

  const handleTulPress = (tul) => {
    if (tul.plan === 'pro') {
      navigation.navigate('pro');
    } else {
      setSelectedTul(tul);
      setLoadingDetails(true);
      fetch(`http://localhost:5000/api/auth/tules/${tul.id}`)
        .then(res => res.json())
        .then(data => {
          setTulDetails(data);
          setLoadingDetails(false);
        })
        .catch(() => {
          Alert.alert('Error', 'No se pudieron cargar los detalles del tul');
          setLoadingDetails(false);
        });
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      {!selectedTul ? (
        <>
          <Header />

          <Text style={styles.title}>Seleccionar el tul</Text>

          {loadingTuls ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              {tuls.map((tul, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tulItem}
                  onPress={() => handleTulPress(tul)}
                >
                  <View style={styles.rowBetween}>
                    <Text style={styles.tulName}>{tul.nombre}</Text>
                    <View style={styles.colorContainer}>
                      {[...tul.colores || ''].map((emoji, i) => (
                        <Text key={i} style={styles.emojiText}>{emoji}</Text>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* ✅ Redirección corregida aquí */}
              <TouchableOpacity
                style={styles.boxStyle}
                onPress={() => navigation.navigate('formadedanes')}
              >
                <Text style={styles.boxText}>Formas Danes I - II - III - IV - V - VI</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.boxStyle}>
                <Text style={styles.boxText}>Explicación y recomendaciones</Text>
              </TouchableOpacity>
            </>
          )}

          <Footer />
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTul(null);
              setTulDetails(null);
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 15 }}>← Seleccionar Tul</Text>
          </TouchableOpacity>

          {loadingDetails ? (
            <ActivityIndicator size="large" color="#000" />
          ) : tulDetails ? (
            <>
              <View style={styles.rowBetween}>
                <Text style={styles.detailTitle}>{tulDetails.nombre}</Text>
                <View style={styles.colorContainer}>
                  {[...tulDetails.colores || ''].map((emoji, i) => (
                    <Text key={i} style={styles.emojiText}>{emoji}</Text>
                  ))}
                </View>
              </View>

              <Text style={styles.mov}>{tulDetails.movimientos} movimientos</Text>

              {tulDetails.significado && (
                <Text style={styles.bold}>{tulDetails.significado}</Text>
              )}

              {tulDetails.descripcion?.split('\n\n').map((p, i) => (
                <Text key={i} style={styles.desc}>{p}</Text>
              ))}

              <TouchableOpacity
                style={styles.startButton}
                onPress={() =>
                  navigation.navigate('posturas', {
                    tulId: tulDetails.id,
                    tulNombre: tulDetails.nombre,
                  })
                }
              >
                <Text style={styles.startText}>Iniciar</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.planPro}>
                  <FontAwesome
                    name="tree"
                    size={16}
                    color="black"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.planText}>Plan Pro</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.theoryButton}>
                  <Text style={styles.theoryText}>Teoría</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text>No se encontraron detalles para este tul.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 20,
    marginLeft: 5,
  },
  tulItem: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  tulName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mov: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  bold: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 15,
    marginTop: 10,
    lineHeight: 22,
  },
  startButton: {
    marginTop: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 8,
  },
  startText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  planPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFFFE2',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  planText: {
    fontWeight: 'bold',
  },
  theoryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  theoryText: {
    fontWeight: 'bold',
  },
  boxStyle: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
