import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header';

export default function AcademiaAdmin() {
  const navigation = useNavigation();
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('nuevos');

  useEffect(() => {
    const fetchContenidos = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://taekwondoitfapp.com/api/auth/tul_contenidos');
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setContenidos(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error al cargar los contenidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchContenidos();
    
  }, []);
  
  

  // Función para eliminar contenido con confirmación
  const handleDelete = async (id) => {
    const confirmar = Platform.OS === 'web'
      ? window.confirm("¿Estás seguro de que deseas eliminar este contenido?")
      : await new Promise((resolve) => {
          Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este contenido?',
            [
              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Eliminar', style: 'destructive', onPress: () => resolve(true) },
            ],
            { cancelable: false }
          );
        });

    if (!confirmar) return;

    try {
      const res = await fetch(`https://taekwondoitfapp.com/api/auth/tul_contenidos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setContenidos(prev => prev.filter(item => item.id !== id));
        if (Platform.OS === 'web') {
          alert('Contenido eliminado con éxito');
        } else {
          Alert.alert('Éxito', 'Contenido eliminado con éxito');
        }
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'web') {
        alert('No se pudo eliminar el contenido');
      } else {
        Alert.alert('Error', 'No se pudo eliminar el contenido');
      }
    }
  };

  const contenidosFiltrados = contenidos
    .filter(c => c.movimiento_o_academia === 'Movimiento')
    .filter(c =>
      (c.titulo && c.titulo.toLowerCase().includes(searchText.toLowerCase())) ||
      (c.tipo_seccion && c.tipo_seccion.toLowerCase().includes(searchText.toLowerCase()))
    );

  const contenidosOrdenados = contenidosFiltrados.sort((a, b) => {
    if (activeTab === 'masVistos') {
      const vistasA = a.vistas || 0;
      const vistasB = b.vistas || 0;
      return vistasB - vistasA;
    } else {
      const idA = a.id || 0;
      const idB = b.id || 0;
      return idB - idA;
    }
  });

  return (
    <View style={styles.container}>
      <Header />

      <TouchableOpacity
        style={styles.dashboardBtn}
        onPress={() => navigation.navigate('homeadmin')}
      >
        <Feather name="home" size={20} color="#000" />
        <Text style={[styles.dashboardText, { marginLeft: 8 }]}>Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Movimientos</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar"
        value={searchText}
        onChangeText={setSearchText}
      />
<View style={styles.sortContainer}>
  <TouchableOpacity
    style={[styles.sortBtn, activeTab === 'masVistos' && styles.sortBtnActive]}
    onPress={() => setActiveTab('masVistos')}
  >
    <Text style={activeTab === 'masVistos' ? { color: '#fff' } : { color: '#000' }}>
      Más vistos
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.sortBtn, activeTab === 'nuevos' && styles.sortBtnActive]}
    onPress={() => setActiveTab('nuevos')}
  >
    <Text style={activeTab === 'nuevos' ? { color: '#fff' } : { color: '#000' }}>
      Nuevos
    </Text>
  </TouchableOpacity>
</View>

      <TouchableOpacity
        style={styles.newBtn}
        onPress={() => navigation.navigate('nuevoaca')}
      >
        <Text style={styles.newBtnText}>+ Nuevo</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#000" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <ScrollView>
          {contenidosOrdenados.map((item) => (
            <View key={item.id} style={styles.card}>
              {item.imagen ? (
                <Image
                  source={{ uri: `https://taekwondoitfapp.com/uploads/${item.imagen}` }}
                  style={styles.videoPlaceholder}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.videoPlaceholder} />
              )}

              <Text style={styles.cardTitle}>
                {item.titulo || `[${item.tipo_seccion}]`}
              </Text>

              {/* Botón eliminar */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Feather name="x" size={20} color="black" />
              </TouchableOpacity>

              {/* Botón editar */}
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('editaca', { contenidoId: item.id })}
              >
                <Text style={styles.editBtnText}>Editar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
    backgroundColor: '#000000',
    
  },
  
  errorText: { color: 'red', marginTop: 10 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    position: 'relative', // Para posicionar el botón eliminar
  },
  videoPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 15,
  },
  deleteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
  },
  editBtn: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  editBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  newBtn: {
    backgroundColor: 'black',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  newBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
