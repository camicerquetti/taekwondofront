import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

export default function MiDojan() {
  const navigation = useNavigation();
  const [escuelas, setEscuelas] = useState([]);
  const [selectedEscuelaId, setSelectedEscuelaId] = useState('');
  const [dojanNombre, setDojanNombre] = useState('');
  const [escuelaDireccion, setEscuelaDireccion] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/auth/escuelas';

  // Función para cargar las escuelas
  const cargarEscuelas = () => {
    setLoading(true);
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setEscuelas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar escuelas:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarEscuelas();
  }, []);

  const handleSelectEscuela = (id) => {
    setSelectedEscuelaId(id);
    const selected = escuelas.find((e) => e.id === id);
    if (selected) {
      setDojanNombre(selected.nombre);
      setEscuelaDireccion(selected.direccion);
    } else {
      setDojanNombre('');
      setEscuelaDireccion('');
    }
  };

  const handleGuardarCambios = () => {
    if (!selectedEscuelaId) {
      Alert.alert('Selecciona una escuela para actualizar.');
      return;
    }

    fetch(`${API_URL}/${selectedEscuelaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: dojanNombre, direccion: escuelaDireccion }),
    })
      .then((res) => res.json())
      .then(() => {
        Alert.alert('Cambios guardados correctamente.');
        cargarEscuelas(); // Opcional: recarga lista para refrescar datos
      })
      .catch((err) => {
        console.error('Error al actualizar:', err);
        Alert.alert('Error al guardar los cambios.');
      });
  };

  const handleRegistrar = () => {
    if (!dojanNombre || !escuelaDireccion) {
      Alert.alert('Completa el nombre y la dirección.');
      return;
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: dojanNombre, direccion: escuelaDireccion }),
    })
      .then((res) => res.json())
      .then(() => {
        Alert.alert('Dojan registrado correctamente.');
        setDojanNombre('');
        setEscuelaDireccion('');
        setSelectedEscuelaId('');
        cargarEscuelas(); // Recarga la lista después de registrar
      })
      .catch((err) => {
        console.error('Error al registrar:', err);
        Alert.alert('Error al registrar el dojan.');
      });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header />

      <View style={styles.form}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <Text style={styles.label}>Seleccionar escuela existente</Text>
            <View style={styles.selectBox}>
              <Picker
                selectedValue={selectedEscuelaId}
                onValueChange={(itemValue) => handleSelectEscuela(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Nueva escuela / Ninguna seleccionada" value="" />
                {escuelas.map((escuela) => (
                  <Picker.Item key={escuela.id} label={escuela.nombre} value={escuela.id} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Nombre del Dojan</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribir nombre del dojan"
              value={dojanNombre}
              onChangeText={setDojanNombre}
            />

            <Text style={styles.label}>Dirección de la escuela</Text>
            <TextInput
              style={styles.input}
              placeholder="Escribir dirección"
              value={escuelaDireccion}
              onChangeText={setEscuelaDireccion}
            />

            <TouchableOpacity style={styles.button} onPress={handleGuardarCambios}>
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegistrar}>
              <Text style={styles.buttonText}>Registrar Dojan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlinedButton} onPress={() => navigation.goBack()}>
              <Text style={styles.outlinedText}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, justifyContent: 'space-between' },
  form: { padding: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 20,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 44,
    color: '#333',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  outlinedText: { color: '#000', fontWeight: 'bold' },
});
