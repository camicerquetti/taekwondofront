import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/header';
import Footer from '../components/footer';

// Componente detalle ajustado al diseño de la imagen
const DetailDan = ({ tul, onBack }) => (
  <ScrollView style={styles.detailContainer}>
    <TouchableOpacity onPress={onBack}>
      <Text style={styles.volverText}>← Volver a Danes</Text>
    </TouchableOpacity>

    {/* Plan Pro como etiqueta */}
    <View style={styles.planTag}>
      <FontAwesome name="tree" size={14} color="#000" />
      <Text style={styles.planText}> Plan pro</Text>
    </View>

    {/* Grado pequeño */}
    <Text style={styles.gradoSmall}>{tul.grado}</Text>

    {/* Nombre grande */}
    <Text style={styles.nombreTul}>{tul.nombre}</Text>

    {/* Flechita */}
    <Text style={styles.arrow}>→</Text>

    {/* Movimientos */}
    <Text style={styles.movimientosText}>{tul.movimientos} movimientos</Text>

    {/* Significado descriptivo */}
    {tul.significado && (
      <Text style={styles.significadoText}>{tul.significado}</Text>
    )}

    {/* Botón iniciar */}
    <TouchableOpacity style={styles.botonIniciar}>
      <Text style={styles.botonIniciarTexto}>Iniciar</Text>
    </TouchableOpacity>
  </ScrollView>
);

const DanesScreen = () => {
  const [danes, setDanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [screen, setScreen] = useState('danes'); // 'danes' | 'detail'
  const [selectedTul, setSelectedTul] = useState(null);

  useEffect(() => {
    fetch('https://taekwondoitfapp.com/api/auth/tules')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(tul => tul.nivel === 'dan');
        setDanes(filtered);
        const initial = {};
        filtered.forEach(tul => {
          if (!initial[tul.grado]) initial[tul.grado] = true;
        });
        setExpandedGroups(initial);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert('Error', 'No se pudieron cargar los danes');
        setLoading(false);
      });
  }, []);

  const toggleGroup = grado => {
    setExpandedGroups(prev => ({
      ...prev,
      [grado]: !prev[grado]
    }));
  };

  const gradoDanToTexto = grado => {
    const m = {
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
    return m[grado] ? `${m[grado].texto} (${m[grado].romano})` : `Dan ${grado}`;
  };

  const grouped = danes.reduce((acc, tul) => {
    if (!acc[tul.grado]) acc[tul.grado] = [];
    acc[tul.grado].push(tul);
    return acc;
  }, {});

  const openDetail = tul => {
    setSelectedTul(tul);
    setScreen('detail');
  };
  const goBack = () => {
    setScreen('danes');
    setSelectedTul(null);
  };

  if (screen === 'detail') {
    return <DetailDan tul={selectedTul} onBack={goBack} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.mainTitle}>Formas Danes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        Object.keys(grouped).sort().map((g, i) => (
          <View key={i}>
            <TouchableOpacity
              style={styles.groupHeader}
              onPress={() => toggleGroup(g)}
            >
              <Text style={styles.groupText}>{gradoDanToTexto(g)}</Text>
              <FontAwesome name={expandedGroups[g] ? 'minus' : 'plus'} color="#fff" />
            </TouchableOpacity>

            {expandedGroups[g] && grouped[g].map((t, j) => (
              <TouchableOpacity
                key={j}
                style={styles.itemBox}
                onPress={() => openDetail(t)}
              >
                <Text style={styles.itemText}>{t.nombre}</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  mainTitle: {
    fontSize: 20, fontWeight: 'bold',
    textAlign: 'center', marginVertical: 20
  },
  groupHeader: {
    backgroundColor: 'black', padding: 12,
    marginHorizontal: 20, marginTop: 10,
    borderRadius: 4, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center'
  },
  groupText: { color: 'yellow', fontWeight: 'bold', fontSize: 16 },
  itemBox: {
    backgroundColor: '#eee', marginHorizontal: 25,
    marginTop: 8, padding: 12, borderRadius: 4
  },
  itemText: { fontSize: 15 },
  buttonGray: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#aaa',
    padding: 15, borderRadius: 8, marginTop: 25,
    marginHorizontal: 20
  },
  buttonGrayText: { textAlign: 'center', fontWeight: 'bold' },
  buttonBlack: {
    backgroundColor: '#000', padding: 15,
    borderRadius: 8, marginTop: 15, marginBottom: 40,
    marginHorizontal: 20
  },
  buttonBlackText: {
    color: '#fff', textAlign: 'center', fontWeight: 'bold'
  },

  // DetailDan estilos
  detailContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  volverText: { fontSize: 16, marginBottom: 20 },
  planTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#DFFFE2', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 12, marginBottom: 6
  },
  planText: { fontSize: 14, fontWeight: 'bold' },
  gradoSmall: { fontSize: 14, color: '#888', marginBottom: 4 },
  nombreTul: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  arrow: { fontSize: 22, marginVertical: 8 },
  movimientosText: { fontSize: 16, marginBottom: 12 },
  significadoText: { fontSize: 14, color: '#333', marginBottom: 20 },
  botonIniciar: {
    borderWidth: 1, borderColor: '#000',
    paddingVertical: 12, borderRadius: 8,
    alignSelf: 'stretch'
  },
  botonIniciarTexto: {
    fontSize: 16, fontWeight: 'bold', textAlign: 'center'
  }
});

export default DanesScreen;
