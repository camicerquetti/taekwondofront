import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import Footer from '../components/footer';
import { useRoute, useNavigation } from '@react-navigation/native';

import { WebView } from 'react-native-webview'; // Para móvil

const BASE_IMAGE_URL = 'https://taekwondoitfapp.com/uploads/';

export default function VerTeoriaScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { tulId, creado } = route.params;

  const [user, setUser] = useState(null);
  const [teoria, setTeoria] = useState(null);
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(null);

  useEffect(() => {
    if (creado) {
      setMensajeExito('Teoría guardada correctamente.');
      setTimeout(() => setMensajeExito(null), 3000);
    }

    const fetchUserAndData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (!storedUser) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (!tulId) {
          setError('No se recibió el ID del tul');
          setLoading(false);
          return;
        }

        const res = await fetch(`https://taekwondoitfapp.com/api/auth/informacion/${tulId}`);
        if (!res.ok) throw new Error('Error en la respuesta del servidor');

        const data = await res.json();

        if (!data.teorias || data.teorias.length === 0) {
          setError('No se encontró la teoría para ese ID');
          setLoading(false);
          return;
        }

        const teoriaRecibida = data.teorias[0];
        const plan = parsedUser.plan?.toLowerCase(); // puede ser 'pro' o 'basico'

        if (teoriaRecibida.tipo === 'PRO' && plan !== 'pro') {
          setRedirecting(true);
          navigation.replace('pro');
          return;
        }

        setTeoria(teoriaRecibida);
        setSecciones(data.secciones || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error al cargar datos');
        setLoading(false);
      }
    };

    fetchUserAndData();
  }, [tulId, navigation]);

  if (redirecting) {
    return (
      <View style={styles.noDataContainer}>
        <Text>Redirigiendo...</Text>
      </View>
    );
  }

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40, flex: 1 }} />;
  if (error)
    return (
      <View style={styles.noDataContainer}>
        <Text>{error}</Text>
      </View>
    );

  const mostrarImagen = (img) => {
    const existe = img && img.trim() !== '';
    const uri = existe ? `${BASE_IMAGE_URL}${img}` : '';
    return existe ? (
      <Image source={{ uri }} style={styles.imagen} />
    ) : (
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderText}>Acá va la imagen</Text>
      </View>
    );
  };

  const mostrarCampo = (label, value, multiline = false) => (
    <View style={styles.fieldContainer}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.readonlyBox, multiline && styles.readonlyBoxMultiline]}>
        <Text style={styles.valueText}>{value ? String(value) : ' '}</Text>
      </View>
    </View>
  );

  const mostrarVideo = (videoUrl) => {
    if (!videoUrl || videoUrl.trim() === '') {
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video</Text>
          <Text style={{ color: '#999' }}>Sin video</Text>
        </View>
      );
    }

    // Detectar si es YouTube y obtener videoId para embed
    const youtubeMatch = videoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );

    let embedUrl = videoUrl;

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    if (Platform.OS === 'web') {
      // En web usamos iframe directamente
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video</Text>
          <View style={styles.videoContainer}>
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
              title="Video embebido"
            />
          </View>
        </View>
      );
    } else {
      // En móvil usamos WebView
      return (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Video</Text>
          <View style={styles.videoContainer}>
            <WebView
              source={{ uri: embedUrl }}
              style={styles.webview}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      {mensajeExito && (
        <View style={styles.mensajeExito}>
          <Text style={{ color: '#155724', textAlign: 'center' }}>{mensajeExito}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.mainTitle}>{teoria.titulo}</Text>

        <Text style={styles.sectionTitle}>Descripción</Text>
        {mostrarCampo('', teoria.descripcion, true)}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}></Text>

        {secciones.length === 0 ? (
          <Text style={{ marginTop: 10 }}>No hay secciones para esta teoría.</Text>
        ) : (
          secciones.map((sec) => (
            <View key={sec.id} style={styles.card}>
               <Text style={styles.sectionTitle}>{sec.titulo}</Text> 
              {mostrarImagen(sec.imagen)}
              {mostrarCampo('Descripción', sec.descripcion, true)}
              {mostrarVideo(sec.video)}
            </View>
          ))
        )}
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <TouchableOpacity style={styles.blackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.blackButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mainTitle: { fontWeight: 'bold', fontSize: 20, marginBottom: 8, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#222' },
  fieldContainer: { marginBottom: 12 },
  label: { fontWeight: '600', color: '#444', marginBottom: 4 },
  readonlyBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  readonlyBoxMultiline: { minHeight: 80 },
  valueText: { color: '#555' },
  imagen: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 6,
    marginBottom: 10,
  },
  placeholderBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 6,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  placeholderText: { color: '#999' },
  card: { marginBottom: 20 },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  mensajeExito: {
    backgroundColor: '#d4edda',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 6,
  },
  blackButton: {
    width: '100%',
    paddingVertical: 14,
    marginTop: 20,
    backgroundColor: '#000',
    borderRadius: 6,
    alignItems: 'center',
  },
  blackButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
