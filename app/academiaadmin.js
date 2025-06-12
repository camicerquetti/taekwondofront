// components/AcademiaAdmin.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header'; // Asegúrate de que la ruta sea correcta (Header.tsx en la misma carpeta)

export default function AcademiaAdmin() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header en lugar de logos */}
      <Header />

      {/* Dashboard Button */}
      <TouchableOpacity
        style={styles.dashboardBtn}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.dashboardText}>🏠 Dashboard</Text>
      </TouchableOpacity>

      {/* Buscador */}
      <Text style={styles.sectionTitle}>Academia</Text>
      <TextInput style={styles.searchInput} placeholder="Buscar" />

      {/* Ordenar */}
      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.sortBtn}>
          <Text>Más vistos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.sortBtn, styles.sortBtnActive]}>
          <Text style={{ color: '#fff' }}>Nuevos</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de cursos (simulada con dos items fijos) */}
      <ScrollView>
        {[1, 2].map((item) => (
          <View key={item} style={styles.card}>
            <View style={styles.videoPlaceholder} />
            <Text style={styles.cardTitle}>
              Principio del Taekwon-Do por el GM Marano.
            </Text>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate('editaca')}
            >
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  dashboardBtn: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardText: { fontWeight: 'bold', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sortContainer: { flexDirection: 'row', marginBottom: 16 },
  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 10,
  },
  sortBtnActive: {
    backgroundColor: '#000',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  videoPlaceholder: {
    height: 150,
    backgroundColor: '#000',
    borderRadius: 6,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  editBtn: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 6,
  },
  editBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
