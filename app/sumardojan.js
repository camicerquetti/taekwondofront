import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const clasesDisponibles = ['Niños', 'Adultos', 'Harmony', 'Clases especiales'];

export default function SumarDojan() {
  const [pantalla, setPantalla] = useState('sumar'); // 'sumar' o 'exito'

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    instructor: '',
    instructorMayor: '',
    dias: [],
    clases: [],
  });

  const toggleSeleccion = (campo, valor) => {
    setForm(prev => ({
      ...prev,
      [campo]: prev[campo].includes(valor)
        ? prev[campo].filter(item => item !== valor)
        : [...prev[campo], valor]
    }));
  };

  const enviarFormulario = async () => {
    const { nombre, direccion, ciudad, instructor, instructorMayor, dias, clases } = form;

    if (!nombre || !direccion || !ciudad || !instructor || !instructorMayor || dias.length === 0 || clases.length === 0) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      const datosAEnviar = {
        nombre,
        direccion,
        ciudad,
        pais: 'ARG',
        instructor,
        instructor_mayor: instructorMayor,
        dias: dias.join(','),
        clases: clases.join(','),
      };

      await axios.post('http://localhost:5000/api/auth/escuelas', datosAEnviar);

      // En vez de alert y reset, cambiamos la pantalla:
      setPantalla('exito');
      setForm({
        nombre: '',
        direccion: '',
        ciudad: '',
        instructor: '',
        instructorMayor: '',
        dias: [],
        clases: [],
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar el dojan.');
    }
  };

  if (pantalla === 'exito') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>¡Dojan registrado con éxito!</Text>
         <Text style={styles.mensaje}>
                Hemos recibido la solicitud de registro de tu dojan. 
                En breve te notificaremos al correo electrónico el estado de tu solicitud.
              </Text>
        <TouchableOpacity style={styles.botonConfirmar} >
          <Text style={styles.textoConfirmar}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Pantalla de formulario (pantalla === 'sumar')
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>¿Quieres sumar tu dojan?</Text>

      <TextInput
        placeholder="Nombre del Dojan"
        style={styles.input}
        value={form.nombre}
        onChangeText={(text) => setForm({ ...form, nombre: text })}
      />

      <TextInput
        placeholder="Dirección"
        style={styles.input}
        value={form.direccion}
        onChangeText={(text) => setForm({ ...form, direccion: text })}
      />

      <TextInput
        placeholder="Ciudad"
        style={styles.input}
        value={form.ciudad}
        onChangeText={(text) => setForm({ ...form, ciudad: text })}
      />

      <TextInput
        placeholder="Instructor"
        style={styles.input}
        value={form.instructor}
        onChangeText={(text) => setForm({ ...form, instructor: text })}
      />

      <TextInput
        placeholder="Instructor mayor"
        style={styles.input}
        value={form.instructorMayor}
        onChangeText={(text) => setForm({ ...form, instructorMayor: text })}
      />

      <Text style={styles.subtitulo}>Días y horarios</Text>
      <View style={styles.botonesContainer}>
        {diasDisponibles.map(dia => (
          <TouchableOpacity
            key={dia}
            style={[
              styles.boton,
              form.dias.includes(dia) && styles.botonSeleccionado
            ]}
            onPress={() => toggleSeleccion('dias', dia)}
          >
            <Text style={form.dias.includes(dia) ? styles.textoSeleccionado : styles.textoBoton}>{dia}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitulo}>Clases para</Text>
      <View style={styles.botonesContainer}>
        {clasesDisponibles.map(clase => (
          <TouchableOpacity
            key={clase}
            style={[
              styles.boton,
              form.clases.includes(clase) && styles.botonSeleccionado
            ]}
            onPress={() => toggleSeleccion('clases', clase)}
          >
            <Text style={form.clases.includes(clase) ? styles.textoSeleccionado : styles.textoBoton}>{clase}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.botonConfirmar} onPress={enviarFormulario}>
        <Text style={styles.textoConfirmar}>Confirmar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonCancelar}
        onPress={() =>
          setForm({
            nombre: '',
            direccion: '',
            ciudad: '',
            instructor: '',
            instructorMayor: '',
            dias: [],
            clases: [],
          })
        }
      >
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  botonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  boton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 4,
  },
  botonSeleccionado: {
    backgroundColor: '#000',
  },
  textoBoton: {
    color: '#000',
  },
  textoSeleccionado: {
    color: '#fff',
  },
  botonConfirmar: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  textoConfirmar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botonCancelar: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  textoCancelar: {
    color: '#000',
    fontWeight: 'bold',
  },
});
