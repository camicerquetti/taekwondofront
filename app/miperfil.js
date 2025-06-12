import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';

const MiPerfilScreen = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  // Campos editables
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [grado, setGrado] = useState('');
  const [categoria, setCategoria] = useState('');

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userId}`);
          const data = await response.json();
          setUsuario(data);
          setNombre(data.nombre);
          setEmail(data.email);
          setGrado(data.grado);
          setCategoria(data.categoria);
        } else {
          console.log('No se encontró el ID de usuario en AsyncStorage');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, []);

  const guardarCambios = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, email, grado, categoria }),
        });
        const data = await response.json();
        alert('Perfil actualizado correctamente');
        setUsuario(data);
        setEditando(false);
      } else {
        console.log('No se encontró el ID de usuario en AsyncStorage');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('No se pudo actualizar el perfil');
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 100 }} size="large" color="#000" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>INTERNATIONAL TAEKWON-DO FEDERATION</Text>
        <Text style={styles.subtitle}>GRUPO NORTE TAEKWON-DO</Text>
      </View>

      {usuario && (
        <View style={styles.profileBox}>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            editable={editando}
            placeholder="Nombre"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={editando}
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={grado}
            onChangeText={setGrado}
            editable={editando}
            placeholder="Grado"
          />
          <TextInput
            style={styles.input}
            value={categoria}
            onChangeText={setCategoria}
            editable={editando}
            placeholder="Categoría"
          />
        </View>
      )}

      {!editando ? (
        <TouchableOpacity style={styles.button} onPress={() => setEditando(true)}>
          <Text style={styles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={guardarCambios}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  logoContainer: { alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 15, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  profileBox: { marginVertical: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontSize: 16,
    padding: 8,
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default MiPerfilScreen;
