import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Introduccion() {
  const navigation = useNavigation();
  const [introducciones, setIntroducciones] = useState([]);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar si estamos en modo edición
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    descripcion2: ''
  });

  const fetchIntroducciones = async () => {
    try {
      const response = await axios.get('https://taekwondoitfapp.com/api/auth/introducciones');
      setIntroducciones(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener las introducciones:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntroducciones();
  }, []);

  const handleEdit = (introduccion) => {
    setFormData({
      titulo: introduccion.titulo,
      descripcion: introduccion.descripcion,
      descripcion2: introduccion.descripcion2 || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    const { titulo, descripcion, descripcion2 } = formData;
    try {
      const response = await axios.put(
        `https://taekwondoitfapp.com/api/auth/editar-introduccion/${introducciones[0]?.id}`, // Asegúrate de pasar el ID correcto
        { titulo, descripcion, descripcion2 }
      );
      alert('Introducción actualizada con éxito!');
      setIsEditing(false);
      fetchIntroducciones(); // Vuelve a cargar los datos
    } catch (error) {
      console.error('Error al actualizar la introducción:', error);
      alert('Hubo un error al actualizar la introducción.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Introducción</Text>

        {introducciones.length === 0 ? (
          <Text style={styles.noDataText}>No se encontraron introducciones.</Text>
        ) : (
          <View style={styles.introduccionContainer}>
            {/* Mostrar introducciones */}
            {introducciones.map((introduccion) => (
              <View key={introduccion.id} style={styles.introduccionItem}>
                <Text style={styles.introduccionTitle}>{introduccion.titulo}</Text>
                <Text style={styles.introduccionDescription}>{introduccion.descripcion}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleEdit(introduccion)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {isEditing && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Editar Introducción</Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={formData.titulo}
              onChangeText={(text) => setFormData({ ...formData, titulo: text })}
            />

            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descripción"
              value={formData.descripcion}
              onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
              multiline
            />

            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Descripción 2 (opcional)"
              value={formData.descripcion2}
              onChangeText={(text) => setFormData({ ...formData, descripcion2: text })}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.buttonText1}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.whiteButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText1}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  whiteButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  buttonText1: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  introduccionContainer: {
    marginBottom: 20,
  },
  introduccionItem: {
    marginBottom: 20,
  },
  introduccionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  introduccionDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
});
