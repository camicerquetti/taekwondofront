import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/header';

const days = ['Lunes', 'Martes', 'Miércoles'];
const classes = ['Niños', 'Adultos', 'Harmony'];

export default function EditScreen() {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    instructor: '',
    instructorMayor: '',
    dias: [],
    clases: [],
  });

  const toggle = (type, value) => {
    setForm((prev) => {
      if (prev[type].includes(value)) {
        return { ...prev, [type]: prev[type].filter((v) => v !== value) };
      } else {
        return { ...prev, [type]: [...prev[type], value] };
      }
    });
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={form.nombre}
          onChangeText={(text) => handleInputChange('nombre', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={form.direccion}
          onChangeText={(text) => handleInputChange('direccion', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={form.ciudad}
          onChangeText={(text) => handleInputChange('ciudad', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Instructor"
          value={form.instructor}
          onChangeText={(text) => handleInputChange('instructor', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Instructor mayor"
          value={form.instructorMayor}
          onChangeText={(text) => handleInputChange('instructorMayor', text)}
        />

        <Text style={styles.label}>Días y horarios</Text>
        <View style={styles.row}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.toggleButton,
                form.dias.includes(day) && styles.activeButton,
              ]}
              onPress={() => toggle('dias', day)}
            >
              <Text style={styles.toggleText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Clases para</Text>
        <View style={styles.row}>
          {classes.map((cls) => (
            <TouchableOpacity
              key={cls}
              style={[
                styles.toggleButton,
                form.clases.includes(cls) && styles.activeButton,
              ]}
              onPress={() => toggle('clases', cls)}
            >
              <Text style={styles.toggleText}>{cls}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botones de acción */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  activeButton: {
    backgroundColor: '#ccc',
  },
  toggleText: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e30613',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
