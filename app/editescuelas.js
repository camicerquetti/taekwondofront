// components/EditEscuela.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/header'; // Ajusta la ruta si es necesario

const DAYS = ['Lunes', 'Martes', 'Miércoles'];
const CLASSES = ['Niños', 'Adultos', 'Harmony'];

export default function EditEscuela() {
  const navigation = useNavigation();
  const route = useRoute();
  const { escuelaId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    pais: 'ARG',
    instructor: '',
    instructor_mayor: '',
    dias: [],   // ej: ['Lunes', 'Miércoles']
    clases: [], // ej: ['Niños', 'Harmony']
  });

  useEffect(() => {
    if (escuelaId != null) {
      fetch(`http://localhost:5000/api/auth/escuelas/${escuelaId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setForm({
            nombre: data.nombre || '',
            direccion: data.direccion || '',
            ciudad: data.ciudad || '',
            pais: data.pais || 'ARG',
            instructor: data.instructor || '',
            instructor_mayor: data.instructor_mayor || '',
            dias: data.dias ? data.dias.split(',') : [],
            clases: data.clases ? data.clases.split(',') : [],
          });
        })
        .catch((err) => {
          console.error('Error al obtener la escuela:', err);
          Alert.alert('Error', 'No se pudo cargar la escuela.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [escuelaId]);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggle = (type, value) => {
    setForm((prev) => {
      const arr = prev[type];
      if (arr.includes(value)) {
        return { ...prev, [type]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [type]: [...arr, value] };
      }
    });
  };

  const handleSave = () => {
    const payload = {
      nombre: form.nombre,
      direccion: form.direccion,
      ciudad: form.ciudad,
      pais: form.pais,
      instructor: form.instructor,
      instructor_mayor: form.instructor_mayor,
      dias: form.dias.join(','),
      clases: form.clases.join(','),
    };

    fetch(`http://localhost:5000/api/auth/escuelas/${escuelaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errBody) => {
            throw new Error(errBody.message || `HTTP ${res.status}`);
          });
        }
        return res.json();
      })
      .then(() => {
        Alert.alert('Éxito', 'Escuela actualizada correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      })
      .catch((err) => {
        console.error('Error al actualizar la escuela:', err);
        Alert.alert('Error', 'No se pudo actualizar la escuela.');
      });
  };

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/auth/escuelas/${escuelaId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errBody) => {
            throw new Error(errBody.message || `HTTP ${res.status}`);
          });
        }
      })
      .then(() => {
        Alert.alert('Eliminado', 'Escuela eliminada correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      })
      .catch((err) => {
        console.error('Error al eliminar la escuela:', err);
        Alert.alert('Error', 'No se pudo eliminar la escuela.');
      });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Escuela</Text>

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#999"
          value={form.nombre}
          onChangeText={(text) => handleInputChange('nombre', text)}
        />

        {/* Dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          placeholderTextColor="#999"
          value={form.direccion}
          onChangeText={(text) => handleInputChange('direccion', text)}
        />

        {/* Ciudad */}
        <Text style={styles.label}>Ciudad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          placeholderTextColor="#999"
          value={form.ciudad}
          onChangeText={(text) => handleInputChange('ciudad', text)}
        />

        {/* País */}
        <Text style={styles.label}>País</Text>
        <TextInput
          style={styles.input}
          placeholder="País"
          placeholderTextColor="#999"
          value={form.pais}
          onChangeText={(text) => handleInputChange('pais', text)}
        />

        {/* Instructor */}
        <Text style={styles.label}>Instructor</Text>
        <TextInput
          style={styles.input}
          placeholder="Instructor"
          placeholderTextColor="#999"
          value={form.instructor}
          onChangeText={(text) => handleInputChange('instructor', text)}
        />

        {/* Instructor mayor */}
        <Text style={styles.label}>Instructor mayor</Text>
        <TextInput
          style={styles.input}
          placeholder="Instructor mayor"
          placeholderTextColor="#999"
          value={form.instructor_mayor}
          onChangeText={(text) => handleInputChange('instructor_mayor', text)}
        />

        {/* Días y horarios */}
        <Text style={styles.label}>Días y horarios</Text>
        <View style={styles.row}>
          {DAYS.map((day) => {
            const isActive = form.dias.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.toggleButton,
                  isActive && styles.activeButton,
                ]}
                onPress={() => toggle('dias', day)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isActive && styles.toggleTextActive,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clases para */}
        <Text style={styles.label}>Clases para</Text>
        <View style={styles.row}>
          {CLASSES.map((cls) => {
            const isActive = form.clases.includes(cls);
            return (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.toggleButton,
                  isActive && styles.activeButton,
                ]}
                onPress={() => toggle('clases', cls)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isActive && styles.toggleTextActive,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botones de acción */}
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: '#ccc',
  },
  toggleText: {
    fontSize: 14,
    color: '#333',
  },
  toggleTextActive: {
    fontWeight: '600',
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 8,
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
