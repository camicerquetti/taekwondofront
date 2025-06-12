// screens/instructor.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ScrollView } from 'react-native';
import Header from '../components/header';

export default function Instructor() {
  const [instructorMayor, setInstructorMayor] = useState('');
  const [instructor, setInstructor] = useState('');
  const [nuevoMayorNombre, setNuevoMayorNombre] = useState('');
  const [nuevoMayorMail, setNuevoMayorMail] = useState('');
  const [nuevoInstructorNombre, setNuevoInstructorNombre] = useState('');
  const [nuevoInstructorMail, setNuevoInstructorMail] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Header />

      <View style={styles.form}>
        <Text style={styles.label}>Mi instructor mayor</Text>
        <View style={styles.selectBox}>
          <Picker selectedValue={instructorMayor} onValueChange={value => setInstructorMayor(value)}>
            <Picker.Item label="Mi instructor mayor" value="" />
            {/* Opciones aquí */}
          </Picker>
        </View>

        <Text style={styles.optional}>Invitar instructor mayor (opcional)</Text>
        <TextInput
          placeholder="Nombre y apellido"
          style={styles.input}
          value={nuevoMayorNombre}
          onChangeText={setNuevoMayorNombre}
        />
        <TextInput
          placeholder="Mail"
          style={styles.input}
          keyboardType="email-address"
          value={nuevoMayorMail}
          onChangeText={setNuevoMayorMail}
        />

        <Text style={styles.label}>Mi instructor</Text>
        <View style={styles.selectBox}>
          <Picker selectedValue={instructor} onValueChange={value => setInstructor(value)}>
            <Picker.Item label="Mi instructor" value="" />
            {/* Opciones aquí */}
          </Picker>
        </View>

        <Text style={styles.optional}>Invitar instructor (opcional)</Text>
        <TextInput
          placeholder="Nombre y apellido"
          style={styles.input}
          value={nuevoInstructorNombre}
          onChangeText={setNuevoInstructorNombre}
        />
        <TextInput
          placeholder="Mail"
          style={styles.input}
          keyboardType="email-address"
          value={nuevoInstructorMail}
          onChangeText={setNuevoInstructorMail}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlinedButton}>
          <Text style={styles.outlinedText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  label: { marginTop: 16, marginBottom: 8, fontWeight: '500', fontSize: 16 },
  optional: { marginTop: 10, fontSize: 14, color: '#666' },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 16,
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
    borderColor: '#000',
    borderWidth: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  outlinedText: { color: '#000', fontWeight: 'bold' },
});
