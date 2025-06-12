import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';
import SubscriptionScreen from './pro'; // << Asegurate de que el path sea correcto

// Componente de detalle visual mejorado
const DetailDan = ({ tul, onBack }) => (
  <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
    <TouchableOpacity onPress={onBack}>
      <Text style={{ fontSize: 16, marginBottom: 15 }}>← Volver a Danes</Text>
    </TouchableOpacity>

    <View style={styles.rowBetween}>
      <Text style={styles.detailTitle}>{tul.nombre}</Text>
      <View style={styles.colorContainer}>
        {[...(tul.colores || '')].map((emoji, i) => (
          <Text key={i} style={styles.emojiText}>{emoji}</Text>
        ))}
      </View>
    </View>

    <Text style={styles.mov}>Grado: {tul.grado}</Text>
    <Text style={styles.mov}>Plan: {tul.plan}</Text>

    {tul.significado && (
      <Text style={styles.bold}>{tul.significado}</Text>
    )}

    {tul.descripcion?.split('\n\n').map((p, i) => (
      <Text key={i} style={styles.desc}>{p}</Text>
    ))}

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

const DanesScreen = ({ navigation }) => {
  const [danes, setDanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [screen, setScreen] = useState('danes'); // 'danes' | 'pro' | 'detail'
  const [selectedTul, setSelectedTul] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/auth/tules')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(tul => tul.nivel === 'dan');
        setDanes(filtered);
        const initialExpanded = {};
        filtered.forEach(tul => {
          if (!initialExpanded[tul.grado]) initialExpanded[tul.grado] = true;
        });
        setExpandedGroups(initialExpanded);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudieron cargar los danes');
        setLoading(false);
      });
  }, []);

  const toggleGroup = (grado) => {
    setExpandedGroups(prev => ({
      ...prev,
      [grado]: !prev[grado]
    }));
  };

  const gradoDanToTexto = (grado) => {
    const grados = {
      '1': { texto: 'Primer Dan', romano: 'I' },
      '2': { texto: 'Segundo Dan', romano: 'II' },
      '3': { texto: 'Tercer Dan', romano: 'III' },
      '4': { texto: 'Cuarto Dan', romano: 'IV' },
      '5': { texto: 'Quinto Dan', romano: 'V' },
      '6': { texto: 'Sexto Dan', romano: 'VI' },
      '7': { texto: 'Séptimo Dan', romano: 'VII' },
      '8': { texto: 'Octavo Dan', romano: 'VIII' },
      '9': { texto: 'Noveno Dan', romano: 'IX' },
    };
    const g = grados[grado];
    return g ? `${g.texto} (${g.romano})` : `Dan ${grado}`;
  };

  const groupedDanes = danes.reduce((acc, tul) => {
    if (!acc[tul.grado]) acc[tul.grado] = [];
    acc[tul.grado].push(tul);
    return acc;
  }, {});

  const handleTulPress = (tul) => {
    if (tul.plan === 'basico') {
      setScreen('pro');
    } else if (tul.plan === 'pro') {
      setSelectedTul(tul);
      setScreen('detail');
    } else {
      Alert.alert('Plan desconocido', 'Este Dan no tiene un plan válido asignado');
    }
  };

  const handleBack = () => {
    setScreen('danes');
    setSelectedTul(null);
  };

  if (screen === 'pro') {
    return <SubscriptionScreen navigation={{ goBack: handleBack }} />;
  }

  if (screen === 'detail') {
    return <DetailDan tul={selectedTul} onBack={handleBack} />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <Text style={styles.title}>Formas Danes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        Object.keys(groupedDanes).sort().map((gradoKey, idx) => (
          <View key={idx}>
            <TouchableOpacity
              style={styles.danHeader}
              onPress={() => toggleGroup(gradoKey)}
            >
              <Text style={styles.danText}>{gradoDanToTexto(gradoKey)}</Text>
              <FontAwesome name={expandedGroups[gradoKey] ? 'minus' : 'plus'} color="white" />
            </TouchableOpacity>

            {expandedGroups[gradoKey] &&
              groupedDanes[gradoKey].map((tul, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.tulBox}
                  onPress={() => handleTulPress(tul)}
                >
                  <Text style={styles.tulText}>{tul.nombre}</Text>
                </TouchableOpacity>
              ))}
          </View>
        ))
      )}

      <TouchableOpacity style={styles.buttonGray}>
        <Text style={styles.buttonGrayText}>Explicación y recomendaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBlack}>
        <Text style={styles.buttonBlackText}>Formas Danes</Text>
      </TouchableOpacity>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20
  },
  danHeader: {
    backgroundColor: 'black',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 4,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  danText: {
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: 16
  },
  tulBox: {
    backgroundColor: '#eee',
    marginHorizontal: 25,
    padding: 12,
    marginTop: 8,
    borderRadius: 4
  },
  tulText: {
    fontSize: 15
  },
  buttonGray: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    marginHorizontal: 20
  },
  buttonGrayText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonBlack: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 40,
    marginHorizontal: 20
  },
  buttonBlackText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
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
});

export default DanesScreen;
