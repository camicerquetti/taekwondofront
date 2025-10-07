import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

const DojanSelectorScreen = () => {
  const [selectedDojan, setSelectedDojan] = useState('');
  const [selectedEscuela, setSelectedEscuela] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [escuelasList, setEscuelasList] = useState([]);
  const [userId, setUserId] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserId(parsed.id);
        }
      } catch (e) {
        console.error('Error cargando usuario:', e);
      }
    };
    loadUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`);
        if (!res.ok) throw new Error('Error al cargar datos de usuario');
        const data = await res.json();

        setSelectedDojan(data.dojan || '');
        setSelectedEscuela(data.escuela || '');
      } catch (error) {
        setMessage('No se pudieron cargar los datos del usuario');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [userId]);

  useEffect(() => {
    const fetchEscuelas = async () => {
      setLoading(true);
      setMessage('');
      setMessageType('');
      try {
        const res = await fetch('https://taekwondoitfapp.com/api/auth/escuelas');
        if (!res.ok) throw new Error('Error al cargar escuelas');
        const data = await res.json();
        setEscuelasList(data);
      } catch (error) {
        setMessage(error.message);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchEscuelas();
  }, []);

  const handleGuardarCambios = async () => {
    // Limpiar mensajes previos
    setMessage('');
    setMessageType('');

    if (!selectedDojan || selectedDojan.trim() === '') {
      setMessage('Por favor seleccioná tu dojang');
      setMessageType('error');
      return;
    }
    if (!selectedEscuela || selectedEscuela.trim() === '') {
      setMessage('Por favor seleccioná tu instructor');
      setMessageType('error');
      return;
    }
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener el usuario logueado');
      return;
    }

    setLoading(true);

    try {
      const responseUsuario = await fetch('https://taekwondoitfapp.com/api/auth/actualizarDojan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          dojan: selectedDojan,
          escuela: selectedEscuela,
        }),
      });

      if (!responseUsuario.ok) throw new Error('Error actualizando usuario');

      setMessage('Cambios guardados correctamente');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header />

      <View style={styles.form}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            {message && typeof message === 'string' ? (
              <Text
                style={[
                  styles.message,
                  messageType === 'success' ? styles.success : styles.error,
                ]}
              >
                {message}
              </Text>
            ) : null}

            <Text style={styles.label}>Mi dojang</Text>
            <View style={styles.selectBox}>
              <Picker
                selectedValue={selectedDojan}
                onValueChange={(itemValue) => setSelectedDojan(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccionar dojang" value="" />
                {escuelasList
                  .slice()
                  .sort((a, b) => a.nombre.localeCompare(b.nombre))
                  .map((escuela) => (
                    <Picker.Item
                      key={escuela.id}
                      label={escuela.nombre}
                      value={escuela.nombre}
                    />
                  ))}
              </Picker>
            </View>

            <Text style={styles.label}>Mi Instructor</Text>
            <View style={styles.selectBox}>
              <Picker
                selectedValue={selectedEscuela}
                onValueChange={(itemValue) => setSelectedEscuela(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Seleccionar Instructor" value="" />
                {escuelasList.map((escuela) => (
                  <Picker.Item
                    key={escuela.id}
                    label={escuela.instructor}
                    value={escuela.instructor}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.blackButton}
              onPress={handleGuardarCambios}
            >
              <Text style={styles.buttonText}>Guardar cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.blackButton}
              onPress={() => navigation.navigate('sumardojan')}
            >
              <Text style={styles.buttonText}>Registrar Dojan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whiteButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.whiteButtonText}>Volver</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, flexGrow: 1, justifyContent: 'center' },
  form: { marginTop: 20 },
  label: { fontSize: 16, marginBottom: 5, fontWeight: '500' },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: { height: 50, width: '100%', color: '#000' },
  blackButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    marginBottom: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  whiteButton: {
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 30,
  },
  whiteButtonText: { color: '#000', fontWeight: 'bold' },
  message: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});

export default DojanSelectorScreen;
