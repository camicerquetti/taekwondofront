import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/header';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function DondePracticar() {
  const navigation = useNavigation();

  const [userLocation, setUserLocation] = useState(null);
  const [escuelasCercanas, setEscuelasCercanas] = useState([]);
  const [escuelaMasCercana, setEscuelaMasCercana] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null); // Ubicación buscada por el usuario

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDWmsOa6axy4YhPs1PMGSzMQBhqf4d8wyA'; // Sustituye con tu clave real

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchEscuelas(latitude, longitude);
      },
      error => {
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const fetchEscuelas = (latitude, longitude) => {
    fetch('http://localhost:5000/api/auth/escuelas')
      .then(response => response.json())
      .then(data => {
        const escuelasConDistancia = data.map(escuela => {
          const distancia = calcularDistancia(latitude, longitude, escuela.latitude, escuela.longitude);
          return { ...escuela, distancia };
        });

        const escuelaMasCercana = escuelasConDistancia.sort((a, b) => a.distancia - b.distancia)[0];
        setEscuelaMasCercana(escuelaMasCercana);
      })
      .catch(error => {
        console.error('Error fetching escuelas:', error);
        Alert.alert('Error', 'No se pudo obtener la información de las escuelas.');
      });
  };

  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg) => deg * (Math.PI / 180);

  const handleOpenMaps = () => {
    navigation.navigate('WebViewScreen', {
      uri: 'https://www.google.com/maps/search/taekwondo+dojang+ITF+argentina/'
    });
  };

  const handleSumarDojan = () => {
    navigation.navigate('sumardojan');
  };

  return (
    <View style={styles.container}>
      <Header />

      <Text style={styles.title}>¿A dónde practicar Taekwon-Do?</Text>

      <TouchableOpacity style={styles.button} onPress={handleOpenMaps}>
        <Text style={styles.buttonText}>📍 Mi ubicación</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setSearchVisible(!searchVisible)}
      >
        <Text style={styles.buttonText}>🔎 Buscar por ciudad/dirección</Text>
      </TouchableOpacity>

      {searchVisible && (
        <GooglePlacesAutocomplete
          placeholder='Buscar una dirección'
          fetchDetails={true}
          onPress={(data, details = null) => {
            const { lat, lng } = details.geometry.location;
            setSearchLocation({ latitude: lat, longitude: lng });
            console.log('Ubicación buscada:', lat, lng);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'es',
            types: 'address',
          }}
          styles={{
            container: {
              flex: 0,
              marginTop: 10,
              marginBottom: 20,
            },
            listView: {
              backgroundColor: 'white',
            },
          }}
        />
      )}

      {escuelaMasCercana ? (
        <View style={styles.escuelasContainer}>
          <Text style={styles.escuelasTitle}>Escuela más cercana:</Text>
          <Text style={styles.escuelaName}>{escuelaMasCercana.nombre}</Text>
          <Text>{escuelaMasCercana.direccion}</Text>

          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?q=${escuelaMasCercana.latitude},${escuelaMasCercana.longitude}&key=${GOOGLE_MAPS_API_KEY}`}
                width="100%"
                height="300px"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            ) : (
              <Text>Mapa no disponible en dispositivos móviles.</Text>
            )}
          </View>
        </View>
      ) : (
        <Text>Cargando información de la escuela más cercana...</Text>
      )}

      {/* Si el usuario buscó una dirección, mostrarla también en el mapa */}
      {searchLocation && (
        <View style={styles.escuelasContainer}>
          <Text style={styles.escuelasTitle}>Ubicación buscada:</Text>
          <View style={styles.mapContainer}>
            {Platform.OS === 'web' ? (
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?q=${searchLocation.latitude},${searchLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`}
                width="100%"
                height="300px"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            ) : (
              <Text>Mapa no disponible en móviles.</Text>
            )}
          </View>
        </View>
      )}

      <TouchableOpacity onPress={handleSumarDojan}>
        <Text style={styles.footerLink}>¿Quieres sumar tu dojan?</Text>
      </TouchableOpacity>

      <View style={styles.footerBox}>
        <Text style={styles.footerText}>
          Plataforma basada en editoriales de Fabián Izquierdo y la enciclopedia del Taekwon-Do.{"\n"}
          Thinking with Mindcircus Agency.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 16 },
  mapContainer: {
    flex: 1,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10
  },
  footerLink: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textDecorationLine: 'underline'
  },
  footerBox: {
    padding: 10,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center'
  },
  escuelasContainer: {
    marginTop: 20,
    paddingHorizontal: 20
  },
  escuelasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  escuelaName: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
