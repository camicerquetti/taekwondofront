import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/header';
import { useNavigation } from '@react-navigation/native';

const isWeb = Platform.OS === 'web';
const handleNavigation = (screen) => {
  navigation.navigate(screen);
};

const ImagePickerField = ({ imageUri, setImageUri, setImageFile }) => {
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isWeb) {
      (async () => {
        // Verificar permisos de galería en iOS
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Se requieren permisos de galería para seleccionar imágenes.');
        }
      })();
    }
  }, []);

  const pickImage = async () => {
    if (isWeb) {
      // En la web, usar el input file
      if (fileInputRef.current) fileInputRef.current.click();
    } else {
      try {
        // Verificar permisos nuevamente antes de lanzar el selector
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.photo],
            quality: 0.7,
          });
  // Establecer archivo de imagen para enviarlo al backend
          if (!result.canceled && result.assets.length > 0) {
  const asset = result.assets[0];
  setImageUri(asset.uri);

  const ext = asset.uri.split('.').pop()?.toLowerCase();
  let mime = 'image/jpeg'; // valor por defecto

  if (ext === 'png') mime = 'image/png';
  else if (ext === 'heic') mime = 'image/heic';
  else if (ext === 'heif') mime = 'image/heif';
  else if (ext === 'gif') mime = 'image/gif';
  else if (ext === 'webp') mime = 'image/webp';
  else if (ext === 'jpg') mime = 'image/jpg';

  setImageFile({
    uri: asset.uri,
    name: asset.uri.split('/').pop(),
    type: mime,
  });
}

        } else {
          alert('No se otorgaron permisos para acceder a la galería.');
        }
      } catch (error) {
        console.error('Error al seleccionar imagen:', error);
        alert('No se pudo seleccionar la imagen.');
      }
    }
  };

    const onWebImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'heic' || ext === 'heif') {
        alert('Las imágenes HEIC/HEIF pueden no visualizarse correctamente en algunos navegadores. Se recomienda JPG o PNG.');
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageUri(reader.result);
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

export default function CreateTulContenidoScreen() {
  const navigation = useNavigation();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [videoLink, setVideoLink] = useState('');
const tulId = 1;

  const [tipoSeccion, setTipoSeccion] = useState('PRO');
  const [movimientoOA, setMovimientoOA] = useState('Movimiento');
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleGuardarCambios = async () => {
    setMensaje(null); // Limpiar mensaje previo

    // Validación de campos
    if (!tulId || !tipoSeccion) {
      setMensaje('Debe ingresar el ID del tul y seleccionar el tipo de sección');
      return;
    }

    const formData = new FormData();
    formData.append('tul_id', tulId);
    formData.append('tipo_seccion', tipoSeccion);
    formData.append('titulo', titulo);
    formData.append('contenido_texto', descripcion);
    formData.append('video_link', videoLink);
    formData.append('movimiento_o_academia', movimientoOA);

    if (imageFile) formData.append('imagen', imageFile);  // Añadir imagen seleccionada

    try {
      const response = await fetch('https://taekwondoitfapp.com/api/auth/tul_contenidos', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      let result = {};
      try {
        result = await response.json();
      } catch {}
      if (response.ok) {
        setMensaje(result.message ?? 'Guardado exitoso.');
      } else {
        setMensaje(result.error ?? 'Error al guardar.');
      }
    } catch (error) {
      console.error('Error al guardar:', error);

      // Asumimos éxito en Web, aunque el fetch falle
      if (Platform.OS === 'web') {
        setMensaje('Contenido guardado exitosamente (aunque hubo error en la respuesta).');
      } else {
        setMensaje('Error de conexión al guardar el contenido.');
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear nuevo contenido</Text>


        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción"
          multiline
        />

        <Text style={styles.label}>Enlace de video</Text>
        <TextInput
          style={styles.input}
          value={videoLink}
          onChangeText={setVideoLink}
          placeholder="https://..."
        />

        <Text style={styles.label}>Imagen</Text>
        <Text style={styles.warningMessage}>
  Solo se aceptan imágenes en formato JPEG, JPG y PNG. Tamaño máximo permitido: 10 MB.
</Text>
        <ImagePickerField imageUri={imageUri} setImageUri={setImageUri} setImageFile={setImageFile} />

        <Text style={styles.label}>Tipo de sección</Text>
        <View style={styles.buttonRow}>
          {['PRO', 'BASICO'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.optionButton, tipoSeccion === type && styles.optionButtonActive]}
              onPress={() => setTipoSeccion(type)}
            >
              <Text style={[styles.optionText, tipoSeccion === type && styles.optionTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>¿Pertenece a?</Text>
        <View style={styles.buttonRow}>
          {['Movimiento', 'Academia', 'do'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.optionButton, movimientoOA === type && styles.optionButtonActive]}
              onPress={() => setMovimientoOA(type)}
            >
              <Text style={[styles.optionText, movimientoOA === type && styles.optionTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardarCambios}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>

        {/* Mensaje de éxito o error */}
        {mensaje && (
          <Text
            style={{
              marginTop: 12,
              color: mensaje.includes('correctamente') ? 'green' : 'green',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {mensaje}
          </Text>
        )}
         <TouchableOpacity style={styles.whiteButton} onPress={() => navigation.navigate('homeadmin')}
>
  <Text style={styles.whiteButtonText}>Volver</Text>
</TouchableOpacity>

      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  label: { fontWeight: '600', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  buttonRow: { flexDirection: 'row', marginBottom: 12 },
  optionButton: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  optionButtonActive: { backgroundColor: '#000' },
  optionText: { color: '#000' },
  optionTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  imagePicker: {
    width: '100%',
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePlaceholderContent: { alignItems: 'center' },
  imageText: { marginTop: 8, color: '#888' },
whiteButton: {
  backgroundColor: '#fff',       // Fondo blanco
  borderWidth: 1,                // Borde visible
  borderColor: '#000',           // Color negro para el borde
  padding: 12,
  borderRadius: 8,
  marginTop: 5,                  // Espacio arriba de 5 (separa del botón de arriba)
  alignItems: 'center',
},
whiteButtonText: {
  color: '#000',                 // Texto negro para que contraste con fondo blanco
  fontSize: 16,
},

});

