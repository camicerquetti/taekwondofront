import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  Platform, TextInput, Modal, ScrollView, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import Footer from '../components/footer';

export default function DondePracticar() {
  const navigation = useNavigation();
  const [escuelasFiltradas, setEscuelasFiltradas] = useState([]);
  const [direccionError, setDireccionError] = useState('');
  const [escuelas, setEscuelas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mapCenter, setMapCenter] = useState({ latitude: -34.6037, longitude: -58.3816 });
  const [userLocation, setUserLocation] = useState(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDWmsOa6axy4YhPs1PMGSzMQBhqf4d8wyA';
  const mapRef = useRef(null);
  const markersRef = useRef([]);
const [paginaActual, setPaginaActual] = useState(0);
const escuelasPorPagina = 2;
const escuelasMostradas = escuelas.slice(
  paginaActual * escuelasPorPagina,
  (paginaActual + 1) * escuelasPorPagina
);

  const handleGoBack = () => navigation.goBack();

  const loadGoogleMapsScript = () => new Promise((resolve) => {
    if (window.google && window.google.maps) { resolve(); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;

    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

  const toRad = (deg) => deg * (Math.PI / 180);
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const geocodeDireccion = async (direccionCompleta) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccionCompleta)}&key=${GOOGLE_MAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) return data.results[0].geometry.location;
      return null;
    } catch (error) {
      console.error("Error geocoding:", error);
      return null;
    }
  };

  const fetchEscuelasConCoords = async (latitude, longitude) => {
    try {
      const res = await fetch('https://taekwondoitfapp.com/api/auth/escuelas');
      const data = await res.json();

      const escuelasConCoords = await Promise.all(
        data.map(async (escuela) => {
          const direccionCompleta = `${escuela.direccion}, ${escuela.ciudad || ''}`;
          const coords = await geocodeDireccion(direccionCompleta);
          if (coords) {
            const distancia = calcularDistancia(latitude, longitude, coords.lat, coords.lng);
            return { ...escuela, latitude: coords.lat, longitude: coords.lng, distancia };
          } else return { ...escuela, latitude: null, longitude: null, distancia: 9999 };
        })
      );

      escuelasConCoords.sort((a, b) => a.distancia - b.distancia);
      setEscuelas(escuelasConCoords);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo obtener la información de las escuelas.");
    }
  };

  const getUserLocation = async () => {
    if (Platform.OS === 'web') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setMapCenter({ latitude, longitude });
          fetchEscuelasConCoords(latitude, longitude);
        },
        () => Alert.alert("Error", "No se pudo obtener la ubicación.")
      );
    } else {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') { Alert.alert("Permiso denegado", "No se pudo obtener la ubicación."); return; }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      setMapCenter({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      fetchEscuelasConCoords(location.coords.latitude, location.coords.longitude);
    }
  };

  const handleSumarDojan = () => navigation.navigate('sumardojan');

  useEffect(() => {
    if (Platform.OS !== 'web' || !mapCenter) return;
    loadGoogleMapsScript().then(() => {
      const map = new window.google.maps.Map(document.getElementById('map'), { center: { lat: mapCenter.latitude, lng: mapCenter.longitude }, zoom: 12 });
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

   if (mapCenter.latitude && mapCenter.longitude) {
  const userMarker = new window.google.maps.Marker({
    position: { lat: mapCenter.latitude, lng: mapCenter.longitude },
    map,
    title: "Mi ubicación"
  });

  const userInfoWindow = new window.google.maps.InfoWindow({
    content: `<div><strong>Mi ubicación</strong></div>`,
  });

  userInfoWindow.open({
    anchor: userMarker,
    map,
    shouldFocus: false,
  });

  userMarker.addListener('click', () => {
    userInfoWindow.open({
      anchor: userMarker,
      map,
      shouldFocus: false,
    });
  });

  markersRef.current.push(userMarker);
}


      if (escuelas.length > 0) {
        escuelas.forEach(escuela => {
          if (escuela.latitude && escuela.longitude) {
            const marker = new window.google.maps.Marker({
              position: { lat: parseFloat(escuela.latitude), lng: parseFloat(escuela.longitude) },
              map,
            });
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div><strong>${escuela.nombre}</strong><br>${escuela.direccion}, ${escuela.ciudad}</div>`,
            });
            marker.addListener('click', () => infoWindow.open(map, marker));
            markersRef.current.push(marker);
          }
        });
      }
      mapRef.current = map;
    });
  }, [escuelas, mapCenter]);
  const obtenerEscuelasConCoords = async (latitude, longitude) => {
  try {
    const res = await fetch('https://taekwondoitfapp.com/api/auth/escuelas');
    const data = await res.json();

    const escuelasConCoords = await Promise.all(
      data.map(async (escuela) => {
        const direccionCompleta = `${escuela.direccion}, ${escuela.ciudad || ''}`;
        const coords = await geocodeDireccion(direccionCompleta);
        if (coords) {
          const distancia = calcularDistancia(latitude, longitude, coords.lat, coords.lng);
          return { ...escuela, latitude: coords.lat, longitude: coords.lng, distancia };
        } else {
          return { ...escuela, latitude: null, longitude: null, distancia: 9999 };
        }
      })
    );

    escuelasConCoords.sort((a, b) => a.distancia - b.distancia);
    return escuelasConCoords;
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "No se pudo obtener la información de las escuelas.");
    return [];
  }
};

const handleBuscar2 = async () => {
  if (!direccion && !ciudad) {
    Alert.alert("Error", "Debes ingresar una ciudad o una dirección.");
    return;
  }

  // Construir consulta para geocodificación
  let consultaGeocode = direccion && ciudad
    ? `${direccion}, ${ciudad}`
    : direccion
    ? `${direccion}, Argentina`
    : ciudad;

  // Validación de dirección
  if (direccion) {
    const addressRegex = /^[0-9A-Za-z\s\.,#'-]+$/;
    if (!addressRegex.test(direccion)) {
      setDireccionError("Dirección con formato inválido.");
      return;
    }
  }

  // Geocodificar
  const coords = await geocodeDireccion(consultaGeocode);
  if (!coords || !coords.lat || !coords.lng) {
    setDireccionError("No se pudo encontrar la ubicación con los datos ingresados.");
    return;
  }

  setDireccionError('');
  setMapCenter({ latitude: coords.lat, longitude: coords.lng });

  // Traer escuelas con coordenadas
  const escuelasConCoords = await obtenerEscuelasConCoords(coords.lat, coords.lng);

  // Filtrar SOLO en base a lo ingresado, sin depender de "Mi ubicación"
  let filtradas = escuelasConCoords;

  if (ciudad && !direccion) {
    filtradas = escuelasConCoords.filter(e =>
      e.ciudad && e.ciudad.toLowerCase().includes(ciudad.toLowerCase())
    );
  } else if (direccion) {
    // en este caso podés decidir si mostrar solo las más cercanas
    filtradas = escuelasConCoords
      .filter(e => e.distancia <= 10) // opcional
      .sort((a, b) => a.distancia - b.distancia);
  }

  setEscuelas(escuelasConCoords);   // lista general
  setEscuelasFiltradas(filtradas);  // lista filtrada para mostrar
  setModalVisible(false);
};


const [sugerencias, setSugerencias] = useState([]);
// Estado para sugerencias
const [escuelasSugerencias, setEscuelasSugerencias] = useState([]);

// Cargar todas las escuelas al inicio para sugerencias
useEffect(() => {
  const precargarEscuelas = async () => {
    try {
      const res = await fetch('https://taekwondoitfapp.com/api/auth/escuelas');
      const data = await res.json();
      setEscuelasSugerencias(data); // SOLO para sugerencias
    } catch (error) {
      console.error("Error cargando escuelas para sugerencias:", error);
    }
  };
  precargarEscuelas();
}, []);
const handleInputChange = (text) => {
  setDireccion(text); // Guardamos lo que escribe el usuario
  if (text.length > 0) {
    const filteredSuggestions = escuelasSugerencias.filter((escuela) =>
      escuela.direccion.toLowerCase().includes(text.toLowerCase())
    );
    setSugerencias(filteredSuggestions);
  } else {
    setSugerencias([]);
  }
};




  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.title}>¿A dónde practicar Taekwon-Do?</Text>

      <TouchableOpacity style={styles.button} onPress={getUserLocation}>
        <FontAwesome name="crosshairs" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}> Mi ubicación</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Buscar por Ciudad/Dirección</Text>
      </TouchableOpacity>

    <View style={styles.mapContainer}>
  {Platform.OS === 'web' ? <div id="map" style={{ width: '100%', height: 300 }} /> : <Text>Mapa no disponible en móvil</Text>}
</View>

{/* Mostrar solo la escuela más cercana */}
{escuelasFiltradas.length > 0 && (
  <View style={styles.escuelasContainer}>
    <Text style={styles.escuelasTitle}>Escuela encontrada:</Text>
    <View style={styles.escuelaItem}>
      <Text style={styles.escuelaName}>{escuelasFiltradas[0].nombre}</Text>
      <Text style={styles.escuelaDetails}>
        Instructor: {escuelasFiltradas[0].instructor}{'\n'}
           Instructor mayor: {escuelasFiltradas[0].instructor_mayor}{'\n'}
        Cantidad de alumnos: {escuelasFiltradas[0].total_usuarios}{'\n'}
     
        {escuelasFiltradas[0].direccion}, {escuelasFiltradas[0].ciudad}
      </Text>
      <Text style={styles.escuelaDistancia}>
        A {escuelasFiltradas[0].distancia && !isNaN(escuelasFiltradas[0].distancia)
          ? `${escuelasFiltradas[0].distancia.toFixed(2)} km`
          : 'Distancia no disponible'}
      </Text>
      <TouchableOpacity
        style={styles.moreInfoButton}
        onPress={() => navigation.navigate('detalleescuelas', { escuelaId: escuelasFiltradas[0].id })}
      >
        <Text style={styles.moreInfoText}>Más información</Text>
      </TouchableOpacity>
    </View>
  </View>
)}


   {escuelas.length > 0 && escuelasFiltradas.length === 0 && (
  <View style={styles.escuelasContainer}>
    <Text style={styles.escuelasTitle}>Estos son los dojang más cercanos a ti:</Text>
    <ScrollView style={styles.scrollEscuelas}>
      {escuelasMostradas.map((escuela, index) => (
        <View key={index} style={styles.escuelaItem}>
          <Text style={styles.escuelaName}>{escuela.nombre}</Text>
          <Text style={styles.escuelaDetails}> 
            Instructor: {escuela.instructor}{'\n'}
            Instuctor mayor: {escuela.instructor_mayor}{'\n'}
            Cantidad de alumnos: {escuela.total_usuarios} {'\n'}
            {escuela.direccion}, {escuela.ciudad}
          </Text>
          <Text style={styles.escuelaDistancia}>
            A {escuela.distancia !== 9999 ? `${escuela.distancia.toFixed(2)} km` : 'Distancia no disponible'}
          </Text>
          <TouchableOpacity style={styles.moreInfoButton} onPress={() => navigation.navigate('detalleescuelas', { escuelaId: escuela.id })}>
            <Text style={styles.moreInfoText}>Más información</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>

    {/* Botones de paginación */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
      <TouchableOpacity
        style={[styles.button, { flex: 1, marginRight: 5 }]}
        disabled={paginaActual === 0}
        onPress={() => setPaginaActual(paginaActual - 1)}
      >
        <Text style={styles.buttonText}>Anterior</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { flex: 1, marginLeft: 5 }]}
        disabled={(paginaActual + 1) * escuelasPorPagina >= escuelas.length}
        onPress={() => setPaginaActual(paginaActual + 1)}
      >
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity style={styles.button} onPress={handleGoBack}>
      <Text style={styles.buttonText}>Regresar</Text>
    </TouchableOpacity>
  </View>
)}

      <View style={styles.footerBox}>
        <Text style={styles.footerText}>¿Quieres sumar tu dojang?</Text>
        <TouchableOpacity style={styles.button} onPress={handleSumarDojan}>
          <Text style={styles.buttonText}>Ingresar aquí</Text>
        </TouchableOpacity>
      </View>
<Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : null}
    style={styles.modalOverlay}
  >
    <ScrollView contentContainerStyle={styles.modalContent}>
      
      {/* Botón cerrar */}
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.modalTitle}>Buscar Dojang por ciudad/dirección</Text>
      
      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={ciudad}
        onChangeText={setCiudad}
        placeholder="Ingresa el nombre de tu ciudad "
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={(text) => {
          setDireccion(text);
          if (direccionError) setDireccionError('');
          handleInputChange(text);  // Filtrar las sugerencias
        }}
        placeholder="Encuentra el dojan más cercano"
      />

      {/* Mostrar error de dirección si existe */}
      {direccionError ? (
        <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
          {direccionError}
        </Text>
      ) : null}

      {/* Mostrar sugerencias */}
      {sugerencias.length > 0 && (
        <ScrollView style={styles.suggestionsContainer}>
          {sugerencias.map((escuela, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => {
                setDireccion(escuela.direccion); // Actualizar la dirección con la sugerencia
                setSugerencias([]); // Limpiar las sugerencias
              }}
            >
              <Text style={styles.suggestionText}>{escuela.direccion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.searchButton} onPress={handleBuscar2}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
</Modal>



      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  button: { backgroundColor: '#000', paddingVertical: 12, marginHorizontal: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  buttonText: { color: '#fff', fontSize: 16, marginLeft: 10 },
  footerBox: { padding: 10, alignItems: 'center' },
  footerText: { fontSize: 16, fontWeight: '500', color: '#333', textAlign: 'center', marginBottom: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 14, marginBottom: 5, fontWeight: '500' },
  input: { height: 45, backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
  searchButton: { backgroundColor: '#000', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  searchButtonText: { color: '#fff', fontSize: 16 },
  escuelasContainer: { flex: 1, padding: 20, backgroundColor: 'white' },
  escuelasTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333', textAlign: 'center' },
  scrollEscuelas: { flex: 1 },
  escuelaItem: { backgroundColor: 'white', borderRadius: 8,  borderColor: 'grey', padding: 15, marginBottom: 15, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  escuelaName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  escuelaDetails: { fontSize: 16, color: 'black', marginBottom: 8 },
  escuelaDistancia: { fontSize: 12, fontWeight: 'bold', color: '#777', marginBottom: 10 },
  moreInfoButton: { backgroundColor: 'black', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 5, alignItems: 'center' },
  moreInfoText: { color: '#fff', fontWeight: 'bold' },
suggestionsContainer: {
  maxHeight: 150,
  backgroundColor: '#fff',
  borderRadius: 10,
  paddingVertical: 5,
  marginTop: -5,
  position: 'absolute',
  top: 235, // ajusta según tu diseño
  left: 20,
  right: 20,
  zIndex: 999,
  elevation: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},
suggestionItem: {
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
suggestionText: {
  fontSize: 16,
  color: '#333',
},


});
