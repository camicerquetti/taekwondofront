import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Para videos en móvil

export default function PrincipioScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { contenidoId } = route.params;

  const [contenido, setContenido] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://taekwondoitfapp.com/api/auth/tul_contenidos/${contenidoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setContenido(data);
        } else {
          Alert.alert('Sin contenido', 'No se encontró el contenido solicitado.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar contenido:', error);
        Alert.alert('Error', 'No se pudo cargar el contenido.');
      })
      .finally(() => setLoading(false));
  }, [contenidoId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!contenido) return null;

  const imagenUrl = contenido.imagen
    ? `https://taekwondoitfapp.com/uploads/${contenido.imagen}`
    : null;

  const renderVideo = () => {
    if (!contenido.video_link || contenido.video_link.trim() === '') return null;

    let embedUrl = contenido.video_link;

    // Detectar YouTube y generar embed URL
    const youtubeMatch = contenido.video_link.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
    );
    if (youtubeMatch) {
      embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    if (Platform.OS === 'web') {
      return (
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
      );
    } else {
      return (
        <View style={styles.videoContainer}>
          <WebView
            source={{ uri: embedUrl }}
            style={styles.webview}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen del contenido */}
      <View style={styles.mediaContainer}>
        {imagenUrl ? (
          <Image source={{ uri: imagenUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>

      {/* Título y descripción */}
      <Text style={styles.title}>{contenido.titulo || 'Sin título'}</Text>
      <Text style={styles.text}>{contenido.contenido_texto || 'Sin descripción disponible.'}</Text>

      {/* Video embebido */}
      {renderVideo()}

      {/* Botones */}
      <TouchableOpacity style={styles.buttonBlack} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Regresar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonBlack}
        onPress={() => navigation.navigate('continuaracademia')}
      >
        <Text style={styles.buttonText}>Siguiente contenido</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  mediaContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'left',
    width: '100%',
  },
  text: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 24,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  buttonBlack: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
