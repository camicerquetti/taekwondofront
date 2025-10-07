import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';
import ProImage from '../assets/images/pro.png';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [tuls, setTuls] = useState([]);
  const [loadingTuls, setLoadingTuls] = useState(true);
  const [selectedTul, setSelectedTul] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [tulDetails, setTulDetails] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://taekwondoitfapp.com/api/auth/tules')
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
      fetch(`https://taekwondoitfapp.com/api/auth/tules/${tul.id}`)
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
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1, backgroundColor: '#fff' }}>
      {!selectedTul ? (
        <>
      
          <View style={styles.header}>
  {/* Botón con flecha que lleva a HomeScreen */}
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Text style={styles.backArrow}>← Home</Text>
  </TouchableOpacity>

  {/* Botón de menú (☰) a la derecha */}
  <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
    <Text style={styles.menuIcon}>☰</Text>
  </TouchableOpacity>
</View>

          <Text style={styles.title}>Seleccionar el tul</Text>

          {loadingTuls ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <>
              {tuls.slice().reverse().map((tul, index) => (
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

              <TouchableOpacity style={styles.boxStyle} onPress={() => navigation.navigate('formadedanes')}>
  <Text style={styles.boxText}>Formas Danes I - II - III - IV - V - VI</Text>
  
  <View style={styles.planPro}>
    <Image source={ProImage} style={styles.proIcon} />
    <Text style={styles.planText}>Plan Pro</Text>
  </View>
</TouchableOpacity>


              <TouchableOpacity style={styles.boxStyle}   onPress={() => navigation.navigate('introduccion')}>
                <Text style={styles.boxText}>Explicación y recomendaciones</Text>
              </TouchableOpacity>
            </>
          )}

          <Footer />
        </>
      ) : (
        <ScrollView style={{ flex: 1 }}>

          
          <TouchableOpacity
            onPress={() => {
              setSelectedTul(null);
              setTulDetails(null);
            }}
          >
            <View style={styles.header}>
  <TouchableOpacity
    onPress={() => {
      setSelectedTul(null);
      setTulDetails(null);
    }}
  >
    <Text style={styles.backArrow}>← Seleccionar Tul</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuButton} onPress={() => navigation.goBack()}>
    <Text style={styles.menuIcon}>☰</Text>
  </TouchableOpacity>
</View>

          </TouchableOpacity>

          {loadingDetails ? (
            <ActivityIndicator size="large" color="#000" />
          ) : tulDetails ? (
            <>
              <View>
                
                <Text style={styles.detailTitle}>{tulDetails.nombre}</Text>
                <View style={styles.colorContainerDetail}>
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
                  <Image source={ProImage} style={styles.proIcon} />
                  <Text style={styles.planText}>Plan Pro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.theoryButton}
                  onPress={() =>
                    navigation.navigate('teoria', {
                      tulId: tulDetails.id
                    })
                  }
                >
                  <Text style={styles.theoryText}>Teoría</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text>No se encontraron detalles para este tul.</Text>
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  colorContainerDetail: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 20,
    marginRight: 5,
  },
  arrow: {
    fontSize: 20,
    marginLeft: 5,
  },
  tulItem: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  tulName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    maxWidth: '80%',
  },
  mov: {
    marginTop: 10,
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
    flexWrap: 'wrap',
  },
  planPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DFFFE2',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    justifyContent: 'center',
    marginBottom: 10,
  },
  proIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 6,
    borderRadius: 4,
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
    marginLeft: 5,
    marginBottom: 10,
  },
  theoryText: {
    fontWeight: 'bold',
  },
 boxStyle: {
  backgroundColor: '#fff',     // Fondo blanco
  borderWidth: 1,              // Borde visible
  borderColor: '#000',         // Borde negro
  padding: 15,
  borderRadius: 10,
  marginTop: 15,
  alignItems: 'center',
},
boxText: {
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
},

  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 10,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},

backArrow: {
  fontSize: 16,
  color: '#000',
},

menuButton: {
  backgroundColor: '#000',  // Fondo negro para el botón
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 18,
},

menuIcon: {
  fontSize: 20,
  color: '#fff',  // Líneas blancas para el icono
  fontWeight: 'bold',
},

});

export default HomeScreen;
