import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/header';

export default function EditarTuls() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {}; // 👈 Recibimos el id desde navegación

  const [tuls, setTuls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://taekwondoitfapp.com/api/auth/tules')
      .then(response => response.json())
      .then(data => {
        console.log('Datos obtenidos:', data);
        setTuls(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los tuls:', error);
        setLoading(false);
      });
  }, []);

  const gupTuls = tuls.filter(t => t.nivel === 'gup');
  const danes = tuls.filter(t => t.nivel === 'dan');

  // Invertimos los *gupTuls*
  const gupTulsInvertidos = gupTuls.reverse();

  const danesPorGrado = danes.reduce((acc, tul) => {
    if (!acc[tul.grado]) acc[tul.grado] = [];
    acc[tul.grado].push(tul);
    return acc;
  }, {});

  // Invertimos las entradas de los *danesPorGrado*
  const danesPorGradoInvertidos = Object.entries(danesPorGrado).reverse();

  const handleEditTul = (tul) => {
    console.log('Navegando con id:', tul.id);
    navigation.navigate('paso1editar', { id: tul.id });
  };

  const handleEditDan = (dan) => {
    console.log('Navegando con id:', dan.id);
    navigation.navigate('paso1editar', { id: dan.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Cargando tuls...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

    <TouchableOpacity
    style={styles.dashboardBtn}
    onPress={() => navigation.navigate('homeadmin')}
  >
    <Ionicons name="home-outline" size={20} color="#000" />
    <Text style={styles.dashboardText}>Dashboard</Text>
  </TouchableOpacity>

      <Text style={styles.sectionTitle}>Tuls</Text>
      {gupTulsInvertidos.map((tul, index) => (  // Mostramos los *gupTuls* invertidos
        <View key={index} style={[styles.tulItem, id === tul.id && { borderColor: 'gold', borderWidth: 2 }]}>
          <Text style={styles.tulName}>{tul.nombre}</Text>
          <View style={styles.colorContainer}>
            {[...tul.colores].map((emoji, i) => (
              <Text key={i} style={{ fontSize: 16 }}>{emoji}</Text>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => handleEditTul(tul)}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Formas Danes</Text>
      {danesPorGradoInvertidos.map(([grado, tulsDelGrado], index) => (  // Mostramos los *danesPorGrado* invertidos
        <View key={index} style={styles.danSection}>
          <View style={styles.danHeader}>
            <Text style={styles.danText}>{grado}º Dan</Text>
            <Text style={styles.danRoman}>{toRoman(grado)}</Text>
            <Ionicons name="remove" size={20} color="#fff" />
          </View>
          {tulsDelGrado.map((tul, i) => (
            <View key={i} style={[styles.danTulItem, id === tul.id && { backgroundColor: '#dff0d8' }]}>
              <Text style={styles.danTulName}>{tul.nombre}</Text>
              <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => handleEditDan(tul)}
              >
                <Ionicons name="create-outline" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

function toRoman(num) {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  return romanNumerals[num - 1] || num;
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  dashboardBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#000', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignSelf: 'center', marginBottom: 20 },
  dashboardText: { marginLeft: 8, fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, alignSelf: 'center' },
  tulItem: { flexDirection: 'row', backgroundColor: '#000', borderRadius: 8, padding: 10, marginBottom: 10, alignItems: 'center' },
  tulName: { color: '#fff', flex: 1, fontWeight: 'bold', fontSize: 16 },
  colorContainer: { flexDirection: 'row', marginRight: 10 },
  editBtn: { backgroundColor: 'green', padding: 6, borderRadius: 6 },
  danSection: { marginTop: 20, marginBottom: 10 },
  danHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#000', padding: 10, borderRadius: 8, marginBottom: 6 },
  danText: { color: 'white', fontWeight: 'bold', flex: 1, fontSize: 16 },
  danRoman: { color: '#fff', marginRight: 10, fontWeight: 'bold' },
  danTulItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 0.5, borderColor: '#ccc' },
  danTulName: { fontSize: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
});
