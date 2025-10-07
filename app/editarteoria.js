import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/header';
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
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

const isWeb = Platform.OS === 'web';

const ImagePickerField = ({ imageUri, setImageUri, setImageFile }) => {
  const fileInputRef = useRef(null);

  const updateImageUri = (uri) => {
    if (!uri) {
      setImageUri(null);
      return;
    }
    const newUri = uri.startsWith('data:') ? uri : `${uri}?${Date.now()}`;
    setImageUri(newUri);
  };

  const pickImage = async () => {
    if (isWeb) {
      if (fileInputRef.current) fileInputRef.current.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:[ImagePicker.MediaType.photo] ,
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
           accept="image/*,.heic,.heif"
          style={{ display: 'none' }}
          onChange={onWebImageChange}
        />
      )}
    </View>
  );
};

export default function EditarTeoria() {
  const navigation = useNavigation();
  const route = useRoute();
const { id: tulId, posturaId } = route.params || {};


console.log(posturaId);  // Verifica si posturaId es correcto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagen2, setImagen2] = useState(null); // Aquí añadimos el estado para imagen2
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenFile2, setImagenFile2] = useState(null); // Aquí añadimos el estado para imagen2 File
  const [loading, setLoading] = useState(true);

  // Cargar datos de la postura
  useEffect(() => {
  const fetchPostura = async () => {
    console.log('fetchPostura iniciado', { posturaId, tulId }); // Verifica que IDs llegan

    if (posturaId && tulId) {
      try {
        const res = await fetch(`https://taekwondoitfapp.com/api/auth/postura?posturaId=${posturaId}&tulId=${tulId}`);
        console.log('Respuesta recibida:', res.status);

        if (!res.ok) throw new Error('Error en la respuesta');

        const data = await res.json();
        console.log('Datos recibidos:', data);

        setNombre(data.nombre || '');
        setDescripcion(data.descripcion || '');
        setOrden(data.orden || '');
        setImagen(data.imagen ? `https://taekwondoitfapp.com/uploads/${data.imagen}` : null);
        setImagen2(data.imagen2 ? `https://taekwondoitfapp.com/uploads/${data.imagen2}` : null);
      } catch (error) {
        console.error('Error al obtener postura:', error);
      } finally {
        setLoading(false);
        console.log('Loading false');
      }
    } else {
      console.log('Faltan postureId o tulId');
      setLoading(false); // Evita quedarse cargando si faltan params
    }
  };

  fetchPostura();
}, [posturaId, tulId]);


  const handleGuardarCambios = async () => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('orden', orden);

    if (imagenFile) {
      if (isWeb) {
        formData.append('imagen', imagenFile);
      } else {
        const uriParts = imagenFile.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('imagen', {
          uri: imagenFile.uri,
          name: `imagen.${fileType}`,
          type: `image/${fileType}`,
        });
      }
    }

    if (imagenFile2) {
      if (isWeb) {
        formData.append('imagen2', imagenFile2);
      } else {
        const uriParts = imagenFile2.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('imagen2', {
          uri: imagenFile2.uri,
          name: `imagen2.${fileType}`,
          type: `image/${fileType}`,
        });
      }
    }

    try {
      const response = await fetch(
        `https://taekwondoitfapp.com/api/auth/posturas/${posturaId}`,
        {
          method: 'PUT',
          headers: { Accept: 'application/json' },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Error al guardar');

      Alert.alert('Éxito', 'Postura actualizada correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la postura');
      console.error('Error al guardar:', error);
    }
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Cargando datos...</Text>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
        
    <Header />
    <ScrollView contentContainerStyle={styles.container}>
      {/* ... todo tu contenido aquí ... */}
    </ScrollView>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Postura</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre de la postura"
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción de la postura"
          multiline
        />

        <Text style={styles.label}>Orden</Text>
        <TextInput
          style={styles.input}
          value={String(orden)}
          onChangeText={(text) => setOrden(text)}
          placeholder="Orden de la postura"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Imagen Principal</Text>
        <Text style={styles.warningMessage}>
          Solo se aceptan imágenes en formato JPEG, JPG y PNG. Tamaño máximo permitido: 10 MB.
        </Text>
        <ImagePickerField imageUri={imagen} setImageUri={setImagen} setImageFile={setImagenFile} />

        <Text style={styles.label}>Posicion de pies</Text> 
        <Text style={styles.warningMessage}>
          Solo se aceptan imágenes en formato JPEG, JPG y PNG. Tamaño máximo permitido: 10 MB.
        </Text>{/* Añadimos el campo para imagen2 */}
        <ImagePickerField imageUri={imagen2} setImageUri={setImagen2} setImageFile={setImagenFile2} />

        <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleGuardarCambios}>
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Volver</Text>
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
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
