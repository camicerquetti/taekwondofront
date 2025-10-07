import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Header from '../components/header';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Instructor() {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = route.params?.userId;

  const [instructorMayor, setInstructorMayor] = useState('');
  const [instructor, setInstructor] = useState('');
  const [nuevoMayorNombre, setNuevoMayorNombre] = useState('');
  const [nuevoMayorMail, setNuevoMayorMail] = useState('');
  const [nuevoInstructorNombre, setNuevoInstructorNombre] = useState('');
  const [nuevoInstructorMail, setNuevoInstructorMail] = useState('');
  const [listaInstructorMayors, setListaInstructorMayors] = useState([]);
  const [listaInstructors, setListaInstructors] = useState([]);
  const [loadingListas, setLoadingListas] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' o 'error'

  // Cargar datos del usuario y setear instructorMayor e instructor
  useEffect(() => {
    if (!userId) return;
    const fetchUsuario = async () => {
      try {
        const resp = await fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`);
        if (!resp.ok) throw new Error(`Error al cargar usuario: ${resp.status}`);
        const data = await resp.json();

        setInstructorMayor(data.instructor_mayor || '');
        setInstructor(data.instructor || '');
      } catch (err) {
        console.error('fetchUsuario error:', err);
        Alert.alert('Error', 'No se pudieron cargar los datos del usuario.');
      }
    };
    fetchUsuario();
  }, [userId]);

  // Cargar listas de instructores, agregando el valor actual si no está incluido
  useEffect(() => {
    const fetchEscuelas = async () => {
      try {
        setLoadingListas(true);
        const resp = await fetch('https://taekwondoitfapp.com/api/auth/escuelas');
        if (!resp.ok) throw new Error(`Error al cargar escuelas: ${resp.status}`);
        const data = await resp.json();

        const setMayor = new Set();
        const setInst = new Set();
        data.forEach(escuela => {
          if (escuela.instructor_mayor?.trim()) setMayor.add(escuela.instructor_mayor.trim());
          if (escuela.instructor?.trim()) setInst.add(escuela.instructor.trim());
        });

        let mayoresArray = Array.from(setMayor).sort();
        let instructorsArray = Array.from(setInst).sort();

        // Agregar instructorMayor si no está en la lista
        if (instructorMayor && !mayoresArray.includes(instructorMayor)) {
          mayoresArray = [instructorMayor, ...mayoresArray];
        }

        // Agregar instructor si no está en la lista
        if (instructor && !instructorsArray.includes(instructor)) {
          instructorsArray = [instructor, ...instructorsArray];
        }

        setListaInstructorMayors(mayoresArray);
        setListaInstructors(instructorsArray);
      } catch (err) {
        console.error('fetchEscuelas error:', err);
        Alert.alert('Error', 'No se pudieron cargar los datos de escuelas.');
      } finally {
        setLoadingListas(false);
      }
    };
    fetchEscuelas();
  }, [instructorMayor, instructor]); // actualización si cambia instructorMayor o instructor

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(null), 4000);
  };

  const handleGuardarCambios = async () => {
  try {
    if (!userId) {
      mostrarMensaje('No se pudo obtener el ID de usuario.', 'error');
      return;
    }

    if (!instructorMayor && !instructor && !nuevoMayorNombre && !nuevoInstructorNombre) {
      mostrarMensaje('Debes seleccionar o ingresar al menos un instructor.', 'error');
      return;
    }

    const payload = {
      userId,
      instructorMayor: instructorMayor || null,
      instructor: instructor || null,
      nuevoMayorNombre: nuevoMayorNombre.trim() || null,
      nuevoMayorMail: nuevoMayorMail.trim() || null,
      nuevoInstructorNombre: nuevoInstructorNombre.trim() || null,
      nuevoInstructorMail: nuevoInstructorMail.trim() || null,
    };

    console.log('Payload a enviar:', payload); // Para debug

    const res = await fetch('https://taekwondoitfapp.com/api/auth/save-instructor-relations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Error al guardar: ${res.status}`);
    mostrarMensaje('Cambios guardados correctamente.', 'success');
  } catch (err) {
    console.error('handleGuardarCambios error:', err);
    mostrarMensaje('No se pudieron guardar los cambios.', 'error');
  }
};

  const enviarInvitacion = async (nombre, email, tipo) => {
    try {
      if (!nombre || !email) return mostrarMensaje(`Completa nombre y correo de ${tipo}`, 'error');

      const payload = {
        to: email,
        subject: `Invitación para unirse como ${tipo} en Taekwondo ITF App`,
        text: `Estimado/a ${nombre},

Nos complace invitarte a formar parte del equipo de instructores de nuestra plataforma oficial de Taekwondo ITF: https://taekwondoitfapp.com

Esta aplicación está diseñada para conectar practicantes, instructores e instituciones dentro del entorno del Taekwondo ITF, brindando herramientas de gestión, comunicación y desarrollo.

Si estás interesado/a en formar parte de nuestro equipo como ${tipo}, por favor contactate con nosotros vía correo electrónico a: contacto@taekwondoitfapp.com

Será un honor contar con tu experiencia y compromiso.

Atentamente,
Equipo Taekwondo ITF
https://taekwondoitfapp.com`,
      };

      const res = await fetch('https://taekwondoitfapp.com/api/auth/send-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error desconocido');
      mostrarMensaje(`Invitación enviada a ${tipo}.`, 'success');
    } catch (err) {
      console.error('Error al enviar invitación:', err);
      mostrarMensaje('No se pudo enviar la invitación.', 'error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Header />
      {mensaje && (
        <View style={[styles.alertBox, tipoMensaje === 'success' ? styles.alertSuccess : styles.alertError]}>
          <Text style={styles.alertText}>{mensaje}</Text>
        </View>
      )}
      <View style={styles.form}>
        <Text style={styles.label}>Mi instructor mayor</Text>
        <View style={styles.selectBox}>
          {loadingListas ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Picker selectedValue={instructorMayor} onValueChange={setInstructorMayor}>
              <Picker.Item label="Mi instructor mayor" value="" />
              {listaInstructorMayors.map((n, i) => (
                <Picker.Item key={i} label={n} value={n} />
              ))}
            </Picker>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGuardarCambios}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <Text style={styles.optional}>Invitar instructor mayor (opcional)</Text>
        <TextInput
          placeholder="Nombre"
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => enviarInvitacion(nuevoMayorNombre, nuevoMayorMail, 'instructor mayor')}
        >
          <Text style={styles.buttonText}>Invitar</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Mi instructor</Text>
        <View style={styles.selectBox}>
          {loadingListas ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Picker selectedValue={instructor} onValueChange={setInstructor}>
              <Picker.Item label="Mi instructor" value="" />
              {listaInstructors.map((n, i) => (
                <Picker.Item key={i} label={n} value={n} />
              ))}
            </Picker>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGuardarCambios}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <Text style={styles.optional}>Invitar instructor (opcional)</Text>
        <TextInput
          placeholder="Nombre"
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => enviarInvitacion(nuevoInstructorNombre, nuevoInstructorMail, 'instructor')}
        >
          <Text style={styles.buttonText}>Invitar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home'))}
        >
          <Text style={styles.outlinedText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  alertBox: { padding: 10, margin: 10, borderRadius: 6 },
  alertSuccess: { backgroundColor: '#d4edda' },
  alertError: { backgroundColor: '#f8d7da' },
  alertText: { color: '#155724', fontSize: 14 },
  form: { padding: 20 },
  label: { marginTop: 16, marginBottom: 8, fontWeight: '500', fontSize: 16 },
  optional: { marginTop: 10, fontSize: 14, color: '#555' },
  selectBox: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 16 },
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
    marginTop: 10,
  },
  outlinedText: { color: '#000', fontWeight: 'bold' },
});
