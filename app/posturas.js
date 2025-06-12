import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PosturasScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tulId, tulNombre } = route.params;

  // Aquí deberías tener definido o traer el usuario logueado,
  // por ejemplo, desde un contexto o almacenamiento local.
  // Para el ejemplo, agrego un usuario simulado:
  const usuarioLogueado = { id: 1, nombre: 'Usuario Demo' };

  const [posturas, setPosturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    interlocutor: '',
    fecha: '',
    lugar: '',
    nota: '',
  });
  const [notas, setNotas] = useState([]);
  const [loadingNotas, setLoadingNotas] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/auth/posturas/${tulId}`)
      .then(res => res.json())
      .then(data => {
        setPosturas(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert('No se pudieron cargar las posturas');
      });
  }, [tulId]);

  useEffect(() => {
    // Cuando cambie la postura, cargar las notas para esa postura
    if (posturas.length > 0) {
      cargarNotas(posturas[currentIndex].id);
    }
  }, [currentIndex, posturas]);

  const cargarNotas = (posturaId) => {
    setLoadingNotas(true);
    // Llamada con posturaId y userId en la ruta
    fetch(`http://localhost:5000/api/auth/notas/${posturaId}/${usuarioLogueado.id}`)
      .then(res => res.json())
      .then(data => {
        setNotas(data);
        setLoadingNotas(false);
      })
      .catch(() => {
        setNotas([]);
        setLoadingNotas(false);
      });
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!formData.nota.trim()) {
      alert('La nota no puede estar vacía');
      return;
    }

    const posturaActual = posturas[currentIndex];

    try {
      const res = await fetch('http://localhost:5000/api/auth/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interlocutor: formData.interlocutor,
          fecha: formData.fecha,
          lugar: formData.lugar,
          nota: formData.nota,
          posturaId: posturaActual.id,
          tulId: tulId,
          userId: usuarioLogueado.id,  // <-- Aquí envías el id del usuario logueado
        }),
      });

      if (!res.ok) throw new Error('Error al guardar la nota');

      // Limpiar form y cerrar modal
      setFormData({ interlocutor: '', fecha: '', lugar: '', nota: '' });
      setModalVisible(false);

      // Recargar notas para mostrar la nueva
      cargarNotas(posturaActual.id);

    } catch (error) {
      alert('No se pudo guardar la nota. Intenta nuevamente.');
    }
  };

  const handleNext = () => {
    if (currentIndex < posturas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 100 }} />;
  }

  const postura = posturas[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.tulNombre} numberOfLines={1} ellipsizeMode="tail">
          {tulNombre}
        </Text>

        <View style={styles.posturaContainer}>
          <Text style={styles.posturaNombre} numberOfLines={1} ellipsizeMode="tail">
            {postura.nombre}
          </Text>
        </View>

        <View style={styles.image2Row}>
          {postura.imagen2 ? (
            <Image
              source={{ uri: `http://localhost:5000/uploads/${postura.imagen2}` }}
              style={styles.image2}
            />
          ) : (
            <View style={styles.image2Placeholder} />
          )}

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.commentButton}>
            <Text style={styles.commentIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{ uri: `http://localhost:5000/uploads/${postura.imagen}` }}
        style={styles.image}
      />

      <View style={styles.nav}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentIndex === 0}>
          <Text style={[styles.navButton, currentIndex === 0 && styles.disabled]}>← Volver</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} disabled={currentIndex === posturas.length - 1}>
          <Text style={[styles.navButton, currentIndex === posturas.length - 1 && styles.disabled]}>
            Siguiente →
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.counter}>{currentIndex + 1} de {posturas.length}</Text>
      <Text style={styles.subtitle}>{postura.descripcion}</Text>
      <Text style={styles.pies}>{postura.pies}</Text>

      {/* Aquí mostramos las notas debajo de la postura */}
      <View style={{ width: '100%', marginTop: 20 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Notas:</Text>
        {loadingNotas ? (
          <ActivityIndicator />
        ) : notas.length === 0 ? (
          <Text style={{ fontStyle: 'italic', color: '#888' }}>No hay notas para esta postura.</Text>
        ) : (
          notas.map((nota) => (
            <View key={nota.id} style={styles.notaContainer}>
              <Text style={styles.notaInterlocutor}>Interlocutor: {nota.interlocutor || 'N/A'}</Text>
              <Text>Fecha: {nota.fecha || 'N/A'}</Text>
              <Text>Lugar: {nota.lugar || 'N/A'}</Text>
              <Text style={styles.notaTexto}>{nota.nota}</Text>
            </View>
          ))
        )}
      </View>

      {/* Modal con formulario completo */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Agregar una nota a: {postura.nombre}</Text>

          <Text style={styles.label}>Interlocutor/a:</Text>
          <TextInput
            style={styles.input}
            placeholder="Interlocutor/a"
            value={formData.interlocutor}
            onChangeText={(text) => handleChange('interlocutor', text)}
          />

          <Text style={styles.label}>Fecha:</Text>
          <TextInput
            style={styles.input}
            placeholder="Fecha"
            value={formData.fecha}
            onChangeText={(text) => handleChange('fecha', text)}
          />

          <Text style={styles.label}>Lugar:</Text>
          <TextInput
            style={styles.input}
            placeholder="Lugar"
            value={formData.lugar}
            onChangeText={(text) => handleChange('lugar', text)}
          />

          <Text style={styles.label}>Nota:</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Nota"
            multiline
            value={formData.nota}
            onChangeText={(text) => handleChange('nota', text)}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Guardar nota</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
            <Text style={{ textAlign: 'center', color: 'gray' }}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 },
  tulNombre: { flex: 2, fontSize: 24, fontWeight: 'bold', color: '#000' },
  posturaContainer: { flex: 3, alignItems: 'center', justifyContent: 'center' },
  posturaNombre: { fontSize: 18, fontWeight: '500' },
  image2Row: { flexDirection: 'row', alignItems: 'center' },
  image2: { width: 40, height: 40, marginLeft: 10 },
  image2Placeholder: { width: 40, height: 40, backgroundColor: '#eee', marginLeft: 10 },
  commentButton: { marginLeft: 10 },
  commentIcon: { fontSize: 18 },
  image: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 20 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginVertical: 10 },
  navButton: { fontSize: 16, color: '#000' },
  disabled: { color: '#ccc' },
  counter: { marginVertical: 10 },
  subtitle: { fontSize: 16, textAlign: 'center' },
  pies: { fontSize: 14, color: 'gray', marginTop: 10 },

  notaContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  notaInterlocutor: {
    fontWeight: 'bold',
  },
  notaTexto: {
    marginTop: 5,
  },

  modalContainer: { padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 10, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginTop: 5,
    borderRadius: 6,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default PosturasScreen;
