// components/EscuelasAdmin.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/header';

export default function EscuelasAdmin() {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('Nuevos'); // 'A-Z' o 'Nuevos'
  const [escuelas, setEscuelas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://taekwondoitfapp.com/api/auth/escuelas')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => setEscuelas(data))
      .catch((err) => {
        console.error('Error al obtener escuelas:', err);
        Alert.alert('Error', 'No se pudieron cargar las escuelas.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrar y ordenar localmente
  const getFilteredData = () => {
    let data = escuelas.filter((e) =>
      e.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    if (sortBy === 'A-Z') {
      data = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
    return data;
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.nombre}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.instructor || '—'}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.ciudad}</Text>
      <Text style={[styles.cell, { flex: 2, textAlign: 'center' }]}>
        {item.total_usuarios || 0}
      </Text>
      <TouchableOpacity
        style={[styles.cell, { flex: 1, alignItems: 'center' }]}
        onPress={() =>
          navigation.navigate('editescuelas', { escuelaId: item.id })
        }
      >
        <Feather name="edit" size={20} color="green" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <View style={styles.container}>
        {/* Botón Dashboard */}
        <TouchableOpacity
          style={styles.dashboardBtn}
          onPress={() => navigation.navigate('homeadmin')}
        >
          <Feather name="home" size={20} color="#000" />
          <Text style={styles.dashboardText}> Dashboard</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Dojanes / Escuelas</Text>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#888" style={{ marginLeft: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Ordenar */}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'A-Z' && styles.sortBtnActive]}
            onPress={() => setSortBy('A-Z')}
          >
            <Text style={[styles.sortText, sortBy === 'A-Z' && styles.sortTextActive]}>
              A-Z
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sortBy === 'Nuevos' && styles.sortBtnActive]}
            onPress={() => setSortBy('Nuevos')}
          >
            <Text style={[styles.sortText, sortBy === 'Nuevos' && styles.sortTextActive]}>
              Nuevos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabla de resultados */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 2 }]}>Nombre</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Instructor</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Ciudad</Text>
          <Text style={[styles.headerCell, { flex: 2, textAlign: 'center' }]}>Practicantes</Text>
          <Text style={[styles.headerCell, { flex: 1, textAlign: 'center' }]}>Acción</Text>
        </View>

        <FlatList
          data={getFilteredData()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRow}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginVertical: 12,
  },
  dashboardText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 42,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#000',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  sortBtnActive: {
    backgroundColor: '#000',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  sortTextActive: {
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
  },
  cell: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
});
