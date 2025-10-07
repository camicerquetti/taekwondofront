import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function Introduccion() {
  const navigation = useNavigation();
  const [introducciones, setIntroducciones] = useState([]);
  const [loading, setLoading] = useState(true); // Para manejar el estado de carga

  // Fetch data from backend
  const fetchIntroducciones = async () => {
    try {
      const response = await axios.get('https://taekwondoitfapp.com/api/auth/introducciones'); // Ajusta la URL según tu backend
      setIntroducciones(response.data); // Almacenar las introducciones en el estado
      setLoading(false); // Dejar de cargar
    } catch (error) {
      console.error('Error al obtener las introducciones:', error);
      setLoading(false); // Dejar de cargar en caso de error
    }
  };

  useEffect(() => {
    fetchIntroducciones(); // Cargar las introducciones al montar el componente
  }, []);

  const handleNext = () => {
    navigation.navigate('introduccion2');
  };

  if (loading) {
    // Mientras se cargan los datos
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
          // Mostrar todas las introducciones
          introducciones.map((introduccion) => (
            <View key={introduccion.id} style={styles.introduccionContainer}>
              <Text style={styles.introduccionTitle}>{introduccion.titulo}</Text>
              <Text style={styles.introduccionDescription}>{introduccion.descripcion}</Text>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Explicación y recomendaciones</Text>
        </TouchableOpacity>

        {/* Botón Volver blanco con el mismo estilo que el de arriba */}
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
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
    textAlign: 'justify',
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
});
