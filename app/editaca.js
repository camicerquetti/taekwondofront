// components/EditScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather, MaterialIcons, Entypo } from '@expo/vector-icons';
import Header from '../components/header'; // Asegúrate de que Header.js esté en la misma carpeta

export default function EditScreen() {
  // Estados para los campos
  const [imageUri, setImageUri] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedContentType, setSelectedContentType] = useState('PRO');

  // Función "vacía" para el picker de imagen (implementa según necesidad)
  const pickImage = () => {
    alert('Aquí abrirías tu ImagePicker de Expo');
  };

  // Agregar enlace de video a la lista
  const handleAddVideo = () => {
    if (videoLink.trim() !== '') {
      setVideos(prev => [...prev, videoLink.trim()]);
      setVideoLink('');
    }
  };

  // Quitar un enlace de video
  const handleRemoveVideo = index => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar</Text>

        {/* --- Agregar foto principal --- */}
        <Text style={styles.label}>Agregar foto principal</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Text style={styles.imageText}>Imagen seleccionada</Text>
          ) : (
            <View style={styles.imagePlaceholderContent}>
              <Feather name="image" size={24} color="#888" />
              <Text style={styles.imageText}>Selecciona una imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* --- Título --- */}
        <Text style={[styles.label, { marginTop: 20 }]}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          placeholderTextColor="#999"
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* --- Descripción con toolbar --- */}
        <Text style={[styles.label, { marginTop: 20 }]}>Descripción</Text>
        <View style={styles.richTextToolbar}>
          <TouchableOpacity style={styles.toolbarButton}>
            <Text style={styles.toolbarFontSize}>14</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-bold" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-italic" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-underline" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Entypo name="list" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <Feather name="link" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          placeholderTextColor="#999"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          textAlignVertical="top"
        />

        {/* --- Agregar enlace de video --- */}
        <Text style={[styles.label, { marginTop: 20 }]}>
          Agregar enlace de video
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="www.youtube.com"
            placeholderTextColor="#999"
            value={videoLink}
            onChangeText={setVideoLink}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.addVideoBtn}
            onPress={handleAddVideo}
          >
            <Feather name="plus-circle" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* --- Videos agregados --- */}
        {videos.length > 0 && (
          <View style={{ marginTop: 10 }}>
            {videos.map((link, index) => (
              <View key={index} style={styles.videoItem}>
                <Text style={styles.videoText}>{link}</Text>
                <TouchableOpacity onPress={() => handleRemoveVideo(index)}>
                  <Feather name="x-circle" size={24} color="#e30613" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* --- Contenido (PRO / BASICO) --- */}
        <Text style={[styles.label, { marginTop: 20 }]}>Contenido:</Text>
        <View style={styles.contentTypeContainer}>
          {['PRO', 'BASICO'].map(type => {
            const isSelected = selectedContentType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.contentTypeButton,
                  isSelected && styles.contentTypeButtonActive,
                ]}
                onPress={() => setSelectedContentType(type)}
              >
                <Text
                  style={[
                    styles.contentTypeText,
                    isSelected && styles.contentTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- Botones de acción --- */}
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => {
            // Aquí iría la lógica de guardar cambios
            alert('Guardar cambios');
          }}
        >
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => {
            // Lógica para eliminar
            alert('Eliminar');
          }}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => {
            // Lógica para cancelar; por ejemplo, navegar hacia atrás
            alert('Cancelar');
          }}
        >
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
    backgroundColor: '#fff',
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
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
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
    height: 120,
    marginTop: 8,
  },
  richTextToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f9f9f9',
  },
  toolbarButton: {
    marginRight: 12,
    padding: 4,
  },
  toolbarFontSize: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addVideoBtn: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  videoText: {
    flex: 1,
    color: '#555',
    fontSize: 14,
  },
  contentTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  contentTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
    marginRight: 12,
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
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#000',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#e30613',
  },
  deleteButtonText: {
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
});
