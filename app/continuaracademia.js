import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../components/header'; // Importa el Header desde la carpeta components

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Reemplaza el logo con el Header */}
      <Header />

      {/* Título y descripción */}
      <Text style={styles.title}>¿Qué es academia Taekwon-do?</Text>
      <Text style={styles.description}>
        Son contenidos como videos tutoriales, informativos, explicativos por grandes competidores, maestros y grandes maestros.
      </Text>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput placeholder="Buscar contenidos" style={styles.searchInput} />
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButtonInactive}>
          <Text style={styles.filterTextInactive}>Mas vistos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButtonActive}>
          <Text style={styles.filterTextActive}>Nuevos</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      {[1, 2].map((item, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.videoPlaceholder} />
          <Text style={styles.cardTitle}>Principio del Taekwon-Do por el GM Marano.</Text>
          <Text style={styles.cardText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard...
            <Text style={styles.link}> Leer más...</Text>
          </Text>
          <View style={styles.cardFooter}>
            {i === 1 && (
              <View style={styles.planPro}>
                <MaterialIcons name="verified" size={16} color="#111" />
                <Text style={styles.planProText}>Plan Pro</Text>
              </View>
            )}
            <TouchableOpacity style={styles.leerMasButton}>
              <Text style={styles.leerMasText}>Leer mas</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Botón Regresar */}
      <TouchableOpacity style={styles.regresarButton}>
        <Text style={styles.regresarText}>Regresar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 8 },
  description: { textAlign: 'center', color: '#444', marginBottom: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterButtonActive: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  filterButtonInactive: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  filterTextInactive: { color: '#000' },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  videoPlaceholder: {
    backgroundColor: '#111',
    height: 180,
    borderRadius: 6,
    marginBottom: 8,
  },
  cardTitle: { fontWeight: 'bold', marginBottom: 4 },
  cardText: { color: '#555', marginBottom: 8 },
  link: { color: '#444', textDecorationLine: 'underline' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planPro: {
    flexDirection: 'row',
    backgroundColor: '#E6FFE5',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  planProText: { marginLeft: 4, fontWeight: '600', color: '#111' },
  leerMasButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  leerMasText: { color: '#fff', fontWeight: 'bold' },
  regresarButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  regresarText: { color: '#fff', fontSize: 16 },
});
