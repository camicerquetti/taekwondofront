import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/header';

const isWeb = Platform.OS === 'web';

const ImagePickerField = ({ imageUri, setImageUri, setImageFile }) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isWeb) {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Se requieren permisos de galería para seleccionar imágenes.');
        }
      })();
    }
  }, []);

  const updateImageUri = (uri) => {
    if (!uri) {
      setImageUri(null);
      return;
    }
    // Evitar caché con timestamp salvo si es base64 (web)
    const newUri = uri.startsWith('data:') ? uri : `${uri}?${Date.now()}`;
    setImageUri(newUri);
  };

  const pickImage = async () => {
    if (isWeb) {
      if (fileInputRef.current) fileInputRef.current.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
      });
      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        updateImageUri(uri);
        setImageFile({ uri });
      }
    }
  };

  const onWebImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateImageUri(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="contain" />
        ) : (
          <View style={styles.imagePlaceholderContent}>
            <Feather name="image" size={24} color="#888" />
            <Text style={styles.imageText}>Selecciona una imagen</Text>
          </View>
        )}
      </TouchableOpacity>
      {isWeb && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onWebImageChange}
        />
      )}
    </View>
  );
};

export default function EditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { contenidoId } = route.params || {};

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [deberesEstudiante, setDeberesEstudiante] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedContentType, setSelectedContentType] = useState('PRO');
  const [movimientoOA, setMovimientoOA] = useState('Movimiento');

  const updateImageUri = (uri) => {
    if (!uri) {
      setImageUri(null);
      return;
    }
    const newUri = uri.startsWith('data:') ? uri : `${uri}?${Date.now()}`;
    setImageUri(newUri);
  };

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const res = await fetch(`https://taekwondoitfapp.com/api/auth/tul_contenidos/${contenidoId}`);
        const data = await res.json();
        setTitulo(data.titulo || '');
        setDescripcion(data.contenido_texto || '');
        setDeberesEstudiante(data.deberes || '');
        setVideoLink(data.video_link || '');
        setSelectedContentType(data.tipo_seccion || 'PRO');
        setMovimientoOA(data.movimiento_o_academia || 'Movimiento');
        if (data.imagen) {
          updateImageUri(`https://taekwondoitfapp.com/uploads/${data.imagen}`);
        } else {
          setImageUri(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (contenidoId) fetchContenido();
  }, [contenidoId]);

  const handleGuardarCambios = async () => {
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido_texto', descripcion);
   
    formData.append('video_link', videoLink);
    formData.append('tipo_seccion', selectedContentType);
    formData.append('movimiento_o_academia', movimientoOA);

    if (imageFile) {
      if (isWeb) {
        formData.append('imagen', imageFile);
      } else {
        const uriParts = imageFile.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('imagen', {
          uri: imageFile.uri,
          name: `imagen.${fileType}`,
          type: `image/${fileType}`,
        });
      }
    }

    try {
      const response = await fetch(
        `https://taekwondoitfapp.com/api/auth/tul_contenidos/${contenidoId}`,
        {
          method: 'PUT',
          headers: { Accept: 'application/json' },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Error al guardar');

      Alert.alert('Éxito', 'Contenido actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el contenido');
      console.error('Error al guardar:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar teoría</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

       

        <Text style={styles.label}>Enlace de video</Text>
        <TextInput style={styles.input} value={videoLink} onChangeText={setVideoLink} />

        <Text style={styles.label}>Agregar foto</Text>
        <ImagePickerField imageUri={imageUri} setImageUri={setImageUri} setImageFile={setImageFile} />

        <Text style={styles.label}>Tipo de contenido</Text>
        <View style={styles.contentTypeContainer}>
          {['PRO', 'BASICO'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.contentTypeButton,
                selectedContentType === type && styles.contentTypeButtonActive,
              ]}
              onPress={() => setSelectedContentType(type)}
            >
              <Text
                style={[
                  styles.contentTypeText,
                  selectedContentType === type && styles.contentTypeTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>¿Pertenece a?</Text>
        <View style={styles.contentTypeContainer}>
          {['Movimiento', 'Academia','do'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.contentTypeButton,
                movimientoOA === type && styles.contentTypeButtonActive,
              ]}
              onPress={() => setMovimientoOA(type)}
            >
              <Text
                style={[
                  styles.contentTypeText,
                  movimientoOA === type && styles.contentTypeTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleGuardarCambios}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 14,
    color: '#000',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  contentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contentTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  contentTypeButtonActive: {
    backgroundColor: '#000',
  },
  contentTypeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  contentTypeTextActive: {
    color: '#fff',
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: '#000',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  imagePicker: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    marginBottom: 12,
  },
  imagePlaceholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#888',
    marginTop: 8,
    fontSize: 14,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
});
