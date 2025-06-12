import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Picker,
  Alert,
} from 'react-native';
import Header from '../components/header';

const PerfilEditScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [pais, setPais] = useState('Argentina');
  const [rol, setRol] = useState('Instructor');
  const [graduacion, setGraduacion] = useState('Gup');

  const roles = ['Instructor', 'Practicante', 'Padre/Madre'];
  const graduaciones = [
    'Gup',
    'I a III Dan',
    'III a VI Dan',
    'Master VII',
    'Master VIII',
    'Gran Master',
  ];

  const userId = 1; // ⚠️ Reemplazar por tu lógica real para obtener el ID

  // Carga inicial de datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setNombre(data.nombre);
          setApellido(data.apellido);
          setEmail(data.email);
          setPais(data.pais);
          setRol(data.instructor_mayor);
          setGraduacion(data.graduacion);
        } else {
          Alert.alert('Error', data.message || 'No se pudieron obtener los datos del usuario.');
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Alert.alert('Error', 'Error al conectar con el servidor.');
      }
    };

    fetchUserData();
  }, []);

  // Función que hace la petición y devuelve la respuesta
  const handleSave = async () => {
    if (!nombre || !apellido || !email || password !== rePassword) {
      Alert.alert('Error', 'Por favor completá todos los campos correctamente.');
      return { success: false, message: 'Validación fallida' };
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          pais,
          rol,
          graduacion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return { success: true, message: 'Perfil actualizado correctamente.' };
      } else {
        Alert.alert('Error', data.message || 'No se pudo actualizar el perfil.');
        return { success: false, message: data.message || 'Error desconocido' };
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      Alert.alert('Error', 'Error al conectar con el servidor.');
      return { success: false, message: 'Error de conexión' };
    }
  };

  // Manejador para el botón que usa la respuesta de handleSave
  const onSavePress = async () => {
    const result = await handleSave();
    if (result.success) {
      // Aquí podés agregar más lógica si querés,
      // como actualizar estados o navegar manualmente
      console.log('Guardado OK:', result.message);
    } else {
      console.log('Error guardando:', result.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

      <View style={styles.logoContainer}>
        <Text style={styles.title}>Editar perfil</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        secureTextEntry
        value={rePassword}
        onChangeText={setRePassword}
      />

      <View style={styles.section}>
        <Text style={styles.label}>País</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={pais}
            onValueChange={(itemValue) => setPais(itemValue)}>
            <Picker.Item label="Argentina" value="Argentina" />
            <Picker.Item label="Chile" value="Chile" />
            <Picker.Item label="Uruguay" value="Uruguay" />
          </Picker>
        </View>
      </View>

      <Text style={styles.label}>Me desempeño como</Text>
      <View style={styles.roleContainer}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleButton, rol === r && styles.selected]}
            onPress={() => setRol(r)}>
            <Text style={[styles.roleText, rol === r ? { color: '#fff' } : { color: '#000' }]}>
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Mi graduación es</Text>
      <View style={styles.gradContainer}>
        {graduaciones.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.gradButton, graduacion === g && styles.selected]}
            onPress={() => setGraduacion(g)}>
            <Text style={[styles.gradText, graduacion === g ? { color: '#fff' } : { color: '#000' }]}>
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={onSavePress}>
        <Text style={styles.saveText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Plataforma basada en editoriales de Fabián Izquierdo y la enciclopedia del Taekwon-Do.
        </Text>
        <Text style={styles.agencyText}>
          Thinking with <Text style={{ fontWeight: 'bold' }}>Mindcircus Agency.</Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#bbb',
    margin: 4,
  },
  selected: {
    backgroundColor: '#000',
  },
  roleText: {
    // color se ajusta dinámicamente
  },
  gradContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gradButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    margin: 4,
  },
  gradText: {
    fontSize: 13,
    // color se ajusta dinámicamente
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 6,
    borderColor: '#000',
  },
  backText: {
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  agencyText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default PerfilEditScreen;
