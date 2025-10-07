import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  StyleSheet, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';

export default function DetalleEscuela() {
  const navigation = useNavigation();
  const route = useRoute();
  const { escuelaId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [escuela, setEscuela] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (escuelaId) {
      axios.get(`https://taekwondoitfapp.com/api/auth/escuelas/${escuelaId}`)
        .then(res => {
          setEscuela(res.data);
        })
        .catch(err => {
          console.error(err);
          setMsg('No se pudo cargar la información de la escuela.');
        })
        .finally(() => setLoading(false));
    }
  }, [escuelaId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!escuela) {
    return (
      <View style={styles.loader}>
        <Text>{msg || 'No se encontró información'}</Text>
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Parseamos días y clases para mostrar como tags (suponiendo que vienen como arrays o string separados)
  const diasArray = typeof escuela.dias === 'string'
    ? escuela.dias.split(',').map(d => d.trim())
    : Array.isArray(escuela.dias) ? escuela.dias : [];

  const clasesArray = typeof escuela.clases === 'string'
    ? escuela.clases.split(',').map(c => c.trim())
    : Array.isArray(escuela.clases) ? escuela.clases : [];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.nombreEscuela}>{escuela.nombre.toUpperCase()}</Text>
  <Text style={styles.label}>Alumnos Registrados</Text>
        <Text style={styles.value}>{escuela.total_usuarios}</Text>
        <Text style={styles.label}>Dirección</Text>
        <Text style={styles.value}>{escuela.direccion}</Text>

        <Text style={styles.label}>Ciudad</Text>
        <Text style={styles.value}>{escuela.ciudad}</Text>

        <Text style={styles.label}>Instructor</Text>
        <Text style={styles.value}>{escuela.instructor}</Text>

        <Text style={styles.label}>Instructor mayor</Text>
        <Text style={styles.value}>{escuela.instructor_mayor}</Text>

        <Text style={styles.label}>Contacto</Text>
        <Text style={styles.value}>{escuela.contacto}</Text>

        <Text style={styles.label}>Días y horarios</Text>
        <View style={styles.tagContainer}>
          {diasArray.length > 0
            ? diasArray.map((dia, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{dia}</Text>
                </View>
              ))
            : <Text style={styles.value}>No especificado</Text>
          }
        </View>

        <Text style={styles.label}>Clases para</Text>
        <View style={styles.tagContainer}>
          {clasesArray.length > 0
            ? clasesArray.map((clase, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{clase}</Text>
                </View>
              ))
            : <Text style={styles.value}>No especificado</Text>
          }
        </View>

        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Regresar</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  container: {
    padding: 20
  },
  nombreEscuela: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase'
  },
  label: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 15,
    color: '#000'
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginTop: 4
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 10
  },
  tag: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100
  },
  tagText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    textAlign: 'center'
  },
  btnBack: {
    marginTop: 30,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
