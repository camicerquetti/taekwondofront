import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Image, StyleSheet, ActivityIndicator, Linking
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../components/header';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProImage from '../assets/images/pro.png';

const baseImageUrl = 'https://taekwondoitfapp.com/uploads/';

export default function MovimientoScreen({ route }) {
  const navigation = useNavigation();

  const [userPlan, setUserPlan] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.nombre || user.name || 'Usuario');
          setUserPlan(user.plan || 'basico');
        }
      } catch (error) {
        console.error('Error al obtener usuario de AsyncStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('nuevos');

  useEffect(() => {
    fetch('https://taekwondoitfapp.com/api/auth/tul_contenidos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContenidos(data);
        } else {
          setError('No se encontraron contenidos');
        }
      })
      .catch(() => setError('Error al cargar contenidos'))
      .finally(() => setLoading(false));
  }, []);

  const contenidosFiltrados = contenidos
.filter(item => (item.movimiento_o_academia || '').trim() === 'Movimiento')

    .filter(item =>
      (item.titulo + ' ' + item.contenido_texto)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === 'masVistos') return (b.visitas || 0) - (a.visitas || 0);
      return (b.id || 0) - (a.id || 0);
    });

  if (loading) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );

  if (error) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text>{error}</Text>
      <TouchableOpacity style={styles.regresarButton} onPress={() => navigation.goBack()}>
        <Text style={styles.regresarText}>Regresar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Text style={styles.title}>¿Qué es movimiento Taekwon-do?</Text>
      <Text style={styles.description}>
        Son contenidos como videos tutoriales, informativos, explicativos.
      </Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#aaa" />
        <TextInput
          placeholder="Buscar contenidos"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={filter === 'masVistos' ? styles.filterButtonActive : styles.filterButtonInactive}
          onPress={() => setFilter('masVistos')}
        >
          <Text style={filter === 'masVistos' ? styles.filterTextActive : styles.filterTextInactive}>
            Más vistos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={filter === 'nuevos' ? styles.filterButtonActive : styles.filterButtonInactive}
          onPress={() => setFilter('nuevos')}
        >
          <Text style={filter === 'nuevos' ? styles.filterTextActive : styles.filterTextInactive}>
            Nuevos
          </Text>
        </TouchableOpacity>
      </View>

      {contenidosFiltrados.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No se encontraron contenidos.</Text>
      )}

      {contenidosFiltrados.map((item, i) => (
        <View key={item.id || i} style={styles.card}>
  {item.imagen ? (
    <Image
      source={{ uri: baseImageUrl + item.imagen }}
      style={styles.mediaImage}
      resizeMode="contain"
      onError={() => console.log('Error cargando imagen:', baseImageUrl + item.imagen)}
    />
  ) : (
    <View style={styles.videoPlaceholder}>
      <Text style={{ color: '#fff', textAlign: 'center', marginTop: 75 }}>Sin imagen</Text>
    </View>
  )}

  {item.video_link && (
    <Text
      style={{ color: 'blue', textDecorationLine: 'underline', marginBottom: 8 }}
      onPress={() => Linking.openURL(item.video_link)}
    >
      Ver video
    </Text>
  )}


          <Text style={styles.cardTitle}>{item.titulo || 'Sin título'}</Text>
          <Text style={styles.cardText} numberOfLines={3}>
            {item.contenido_texto || 'Sin contenido'}
          </Text>

          <View style={styles.cardFooter}>
        {item.tipo_seccion === 'PRO' && (
  <View style={styles.planPro}>
    <Image source={ProImage} style={styles.proIcon} />
    <Text style={styles.planText}>Plan Pro</Text>
  </View>
)}

            <TouchableOpacity
              style={styles.leerMasButton}
              onPress={() => {
                if (!userPlan) {
                  console.log('El plan aún no se ha cargado correctamente');
                  return;
                }

                if (item.tipo_seccion === 'PRO') {
                  if (userPlan === 'pro') {
                    navigation.navigate('academia', { contenidoId: item.id });
                  } else {
                    
                    navigation.navigate('pro');
                  }
                } else if (item.tipo_seccion === 'BASICO') {
                  if (userPlan === 'pro' || userPlan === 'basico') {
                    navigation.navigate('academia', { contenidoId: item.id });
                  } else {
                    alert('Este contenido solo está disponible para usuarios registrados.');
                  }
                } else {
                  navigation.navigate('academia', { contenidoId: item.id });
                }
              }}
            >
              <Text style={styles.leerMasText}>Leer más</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.regresarButton} onPress={() => navigation.goBack()}>
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
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F3F3',
    borderRadius: 10, paddingHorizontal: 12, height: 40, marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8 },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterButtonActive: {
    backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 8,
    borderRadius: 10, marginLeft: 8,
  },
  filterButtonInactive: {
    backgroundColor: '#F3F3F3', paddingHorizontal: 20,
    paddingVertical: 8, borderRadius: 10,
  },
  filterTextActive: { color: '#fff', fontWeight: 'bold' },
  filterTextInactive: { color: '#000' },
  card: {
    backgroundColor: '#fff', padding: 12, borderRadius: 10,
    marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1,
    shadowRadius: 6, elevation: 3,
  },
  videoPlaceholder: {
    backgroundColor: '#111', height: 180, borderRadius: 6, marginBottom: 8,
  },
  mediaImage: { width: '100%', height: 180, marginBottom: 8 },
  cardTitle: { fontWeight: 'bold', marginBottom: 4 },
  cardText: { color: '#555', marginBottom: 8 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planPro: {
    flexDirection: 'row', backgroundColor: '#E6FFE5', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center',
  },
  planProText: { marginLeft: 4, fontWeight: '600', color: '#111' },
  leerMasButton: {
    backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6,
  },
  leerMasText: { color: '#fff', fontWeight: 'bold' },
  regresarButton: {
    backgroundColor: '#000', paddingVertical: 12, borderRadius: 10,
    alignItems: 'center', marginTop: 10, marginBottom: 30,
  },
  regresarText: { color: '#fff', fontSize: 16 },
  proIcon: {
  width: 16,
  height: 16,
  resizeMode: 'contain',
  marginRight: 6,
},

});
