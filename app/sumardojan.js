import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Header from '../components/header';
import Footer from '../components/footer';

const diasDisponibles = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const turnosDisponibles = ['Mañana', 'Tarde', 'Noche'];
const clasesDisponibles = ['Niños', 'Adultos', 'Harmony', 'Clases especiales'];

export default function SumarDojan() {
  const [pantalla, setPantalla] = useState('sumar');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isProfesor, setIsProfesor] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    instructor: '',
    instructorMayor: '',
    contacto: '',
    dias: [],
    clases: [],
  });

  // 🔐 Verifica el rol del usuario al cargar la pantalla
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
        const rolesPermitidos = ['profesor', 'instructor_mayor'];
if (rolesPermitidos.includes(user.role)) {
  setIsProfesor(true);
}

        }
      } catch (err) {
        console.error('Error leyendo el usuario:', err);
      } finally {
        setLoading(false);
      }
    };
    checkUserRole();
  }, []);

  const toggleDiaTurno = (dia, turno) => {
    const valor = `${dia} - ${turno}`;
    setForm(prev => ({
      ...prev,
      dias: prev.dias.includes(valor)
        ? prev.dias.filter(item => item !== valor)
        : [...prev.dias, valor],
    }));
    setError('');
  };

  const toggleSeleccion = (campo, valor) => {
    setForm(prev => ({
      ...prev,
      [campo]: prev[campo].includes(valor)
        ? prev[campo].filter(item => item !== valor)
        : [...prev[campo], valor]
    }));
    setError('');
  };

  const enviarFormulario = async () => {
    const { nombre, direccion, ciudad, instructor, instructorMayor, contacto, dias, clases } = form;

    if (!nombre.trim()) return setError('Por favor ingresa el nombre del Dojan.');
    if (!direccion.trim()) return setError('Por favor ingresa la dirección.');
    if (!ciudad.trim()) return setError('Por favor ingresa la ciudad.');
    if (!instructor.trim()) return setError('Por favor ingresa el nombre del instructor.');
    if (!instructorMayor.trim()) return setError('Por favor ingresa el nombre del instructor mayor.');
    if (!contacto.trim()) return setError('Por favor ingresa un medio de contacto.');
    if (dias.length === 0) return setError('Por favor selecciona al menos un día y turno.');
    if (clases.length === 0) return setError('Por favor selecciona al menos una clase.');

    setError('');

    try {
      const datosAEnviar = {
        nombre,
        direccion,
        ciudad,
        pais: 'ARG',
        instructor,
        instructor_mayor: instructorMayor,
        contacto,
        dias: dias.join(','),
        clases: clases.join(','),
      };

      await axios.post('https://taekwondoitfapp.com/api/auth/escuelas', datosAEnviar);

      setPantalla('exito');
      setForm({
        nombre: '',
        direccion: '',
        ciudad: '',
        instructor: '',
        instructorMayor: '',
        contacto: '',
        dias: [],
        clases: [],
      });

    } catch (error) {
      console.error(error);
      setError('No se pudo registrar el dojan. Intenta nuevamente.');
    }
  };

  // ⏳ Mientras se verifica el usuario
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ Si no es profesor, mostrar acceso denegado
  if (!isProfesor) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.titulo}>Acceso denegado</Text>
        <Text style={styles.mensaje}>Solo los usuarios con rol "Instructor" pueden acceder a esta sección.</Text>
    <TouchableOpacity style={styles.botonConfirmar} onPress={() => navigation.navigate('home')}>
  <Text style={styles.textoConfirmar}>Volver</Text>
</TouchableOpacity>

        <Footer />
      </View>
    );
  }

  // ✅ Si es profesor, mostrar formulario normal
  if (pantalla === 'exito') {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.titulo}>¡Dojan registrado con éxito!</Text>
        <Text style={styles.mensaje}>
          Hemos recibido la solicitud de registro de tu dojan. 
          En breve te notificaremos al correo electrónico el estado de tu solicitud.
        </Text>
        <TouchableOpacity style={styles.botonConfirmar} onPress={() => setPantalla('sumar')}>
          <Text style={styles.textoConfirmar}>Volver</Text>
        </TouchableOpacity>
        <Footer />
      </View>
    );
  }
  return (
    <View style={{flex: 1}}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>¿Quieres sumar tu dojang?</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>Nombre del Dojang</Text>
        <TextInput
          style={styles.input}
          value={form.nombre}
          onChangeText={(text) => {
            setForm({ ...form, nombre: text });
            if (error) setError('');
          }}
        />

        {/* Campo Dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          value={form.direccion}
          onChangeText={(text) => {
            setForm({ ...form, direccion: text });
            if (error) setError('');
          }}
        />

        {/* Campo Ciudad */}
        <Text style={styles.label}>Ciudad</Text>
        <TextInput
          style={styles.input}
          value={form.ciudad}
          onChangeText={(text) => {
            setForm({ ...form, ciudad: text });
            if (error) setError('');
          }}
        />

        {/* Campo Instructor */}
        <Text style={styles.label}>Instructor</Text>
        <TextInput
          style={styles.input}
          value={form.instructor}
          onChangeText={(text) => {
            setForm({ ...form, instructor: text });
            if (error) setError('');
          }}
        />

        {/* Campo Instructor Mayor */}
        <Text style={styles.label}>Instructor Mayor</Text>
        <TextInput
          style={styles.input}
          value={form.instructorMayor}
          onChangeText={(text) => {
            setForm({ ...form, instructorMayor: text });
            if (error) setError('');
          }}
        />

        {/* Campo Contacto */}
        <Text style={styles.label}>Contacto (Email o Teléfono)</Text>
        <TextInput
          style={styles.input}
          value={form.contacto}
          onChangeText={(text) => {
            setForm({ ...form, contacto: text });
            if (error) setError('');
          }}
          keyboardType="email-address"
        />

        {/* Días y horarios */}
        <Text style={styles.subtitulo}>Días y horarios</Text>
        {diasDisponibles.map(dia => (
          <View key={dia} style={styles.filaHorizontal}>
            <Text style={styles.diaTexto}>{dia}:</Text>
            <View style={styles.turnosContainer}>
              {turnosDisponibles.map(turno => {
                const valor = `${dia} - ${turno}`;
                const seleccionado = form.dias.includes(valor);
                return (
                  <TouchableOpacity
                    key={turno}
                    style={[styles.boton, seleccionado && styles.botonSeleccionado]}
                    onPress={() => toggleDiaTurno(dia, turno)}
                  >
                    <Text style={seleccionado ? styles.textoSeleccionado : styles.textoBoton}>{turno}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Clases */}
        <Text style={styles.subtitulo}>Clases para</Text>

{/* Primeras 3 clases en 3 columnas */}
<View style={styles.filaTresColumnas}>
  {clasesDisponibles.slice(0, 3).map(clase => (
    <TouchableOpacity
      key={clase}
      style={[
        styles.botonTresColumnas,
        form.clases.includes(clase) && styles.botonSeleccionado,
      ]}
      onPress={() => toggleSeleccion('clases', clase)}
    >
      <Text
        style={
          form.clases.includes(clase)
            ? styles.textoSeleccionado
            : styles.textoBoton
        }
      >
        {clase}
      </Text>
    </TouchableOpacity>
  ))}
</View>

{/* Última clase en fila completa */}
{clasesDisponibles.length > 3 && (
  <TouchableOpacity
    key={clasesDisponibles[3]}
    style={[
      styles.botonFilaCompleta,
      form.clases.includes(clasesDisponibles[3]) && styles.botonSeleccionado,
    ]}
    onPress={() => toggleSeleccion('clases', clasesDisponibles[3])}
  >
    <Text
      style={
        form.clases.includes(clasesDisponibles[3])
          ? styles.textoSeleccionado
          : styles.textoBoton
      }
    >
      {clasesDisponibles[3]}
    </Text>
  </TouchableOpacity>
)}

        {error ? <Text style={styles.errorTexto}>{error}</Text> : null}

        <TouchableOpacity style={styles.botonConfirmar} onPress={enviarFormulario}>
          <Text style={styles.textoConfirmar}>Confirmar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonCancelar}
          onPress={() => {
            setForm({
              nombre: '',
              direccion: '',
              ciudad: '',
              instructor: '',
              instructorMayor: '',
              contacto: '',
              dias: [],
              clases: [],
            });
            setError('');
          }}
        >
          <Text style={styles.textoCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    marginTop: 10,
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
    borderRadius: 0,
    padding: 12,
    marginBottom: 10,
  },
  filaHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  diaTexto: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
    width: 80,
  },
  turnosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  botonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  boton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
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
  errorTexto: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
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
    filaTresColumnas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botonTresColumnas: {
    width: '30%',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  botonFilaCompleta: {
    width: '100%',
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  botonSeleccionado: {
    backgroundColor: 'black',
  },
  textoBoton: {
    color: '#000',
  },
  textoSeleccionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
