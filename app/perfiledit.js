import React, { useState, useEffect } from 'react';
import { Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../components/header';

const PerfilEditScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [pais, setPais] = useState('Argentina');
  const [rol, setRol] = useState('Practicante');
  const [graduacion, setGraduacion] = useState('Gup');
  const [iconoSeleccionado, setIconoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const roles = ['Instructor', 'Practicante', 'Padre/Madre'];

  const graduacionIcons = [
    require('../assets/images/Frame 427318971.jpg'), // 0
    require('../assets/images/Group 8999 (2).jpg'),  // 1
    require('../assets/images/Group 8998.jpg'),      // 2
    require('../assets/images/Group 9000 (3).jpg'),  // 3
    require('../assets/images/Group 9001.jpg'),      // 4
    require('../assets/images/Frame 427318974.jpg'), // 5
    require('../assets/images/Group 9004.jpg'),      // 6
    require('../assets/images/Group 9002.jpg'),      // 7
    require('../assets/images/Group 9005.jpg'),      // 8
    require('../assets/images/Group 9006.jpg'),      // 9
    require('../assets/images/Group 9007.jpg'),      // 10
  ];

  // Mapeo de índice a objeto cinturón
  const beltMapping = {
    0: { color: 'blanco', puntas: 0, tipo: 'gup' },
    1: { color: 'amarillo', puntas: 1, tipo: 'gup' },
    2: { color: 'amarillo', puntas: 2, tipo: 'gup' },
    3: { color: 'verde', puntas: 1, tipo: 'gup' },
    4: { color: 'verde', puntas: 2, tipo: 'gup' },
    5: { color: 'azul', puntas: 1, tipo: 'gup' },
    6: { color: 'azul', puntas: 2, tipo: 'gup' },
    7: { color: 'rojo', puntas: 1, tipo: 'gup' },
    8: { color: 'rojo', puntas: 2, tipo: 'gup' },
    9: { color: 'negro', dan: 1, tipo: 'dan' },
    10: { color: 'negro', dan: 2, tipo: 'dan' },
  };

  const graduaciones = [
    'I a III Dan',
    'III a VI Dan',
    'Master VII',
    'Master VIII',
    'Gran Master',
  ];

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setNombre(data.nombre);
        setApellido(data.apellido);
        setEmail(data.email);
        setPais(data.pais);

        let rolValue = 'Practicante';
        if (data.role === 'profesor') rolValue = 'Instructor';
        else if (data.role === 'padre') rolValue = 'Padre/Madre';

        setRol(rolValue);
        setGraduacion(data.graduacion);

        // Convertir belt recibido (como string o como objeto)
        const userBelt = typeof data.belt === 'string' ? JSON.parse(data.belt) : data.belt;

        const beltIndexEntry = Object.entries(beltMapping).find(
          ([index, beltObj]) => JSON.stringify(beltObj) === JSON.stringify(userBelt)
        );
        setIconoSeleccionado(beltIndexEntry ? Number(beltIndexEntry[0]) : null);

        setMensaje(null);
      } else {
        setMensaje({ tipo: 'error', texto: data.message || 'No se pudieron obtener los datos del usuario.' });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setMensaje({ tipo: 'error', texto: 'Error al conectar con el servidor.' });
    }
  };

  useEffect(() => {
    if (!userId) {
      setMensaje({ tipo: 'error', texto: 'No se recibió el ID de usuario.' });
      return;
    }
    fetchUserData();
  }, [userId]);

  const showMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => {
      setMensaje(null);
    }, 5000);
  };

  const handleSave = async () => {
    if (!nombre || !apellido || !email || password !== rePassword) {
      showMensaje('error', 'Por favor completá todos los campos correctamente.');
      return;
    }

    let backendRol = 'estudiante';
    if (rol === 'Instructor') backendRol = 'profesor';
    else if (rol === 'Padre/Madre') backendRol = 'padre';

    const belt = iconoSeleccionado !== null ? beltMapping[iconoSeleccionado] : null;

    try {
      const response = await fetch(`https://taekwondoitfapp.com/api/auth/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          pais,
          role: backendRol,
          graduacion,
          belt: JSON.stringify(belt), // Enviar como string JSON
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showMensaje('exito', 'Perfil actualizado correctamente.');
        await fetchUserData();
      } else {
        showMensaje('error', data.message || 'No se pudo actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      showMensaje('error', 'Error al conectar con el servidor.');
    }
  };

  const firstRowIcons = graduacionIcons.slice(0, 6);
  const secondRowIcons = graduacionIcons.slice(6);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View style={styles.logoContainer}>
        <Text style={styles.title}>Editar perfil</Text>
      </View>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Apellido" value={apellido} onChangeText={setApellido} />
      <TextInput style={styles.input} placeholder="Correo electrónico" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Repetir contraseña" secureTextEntry value={rePassword} onChangeText={setRePassword} />

      <View style={styles.section}>
        <Text style={styles.label}>País</Text>
        <View style={styles.picker}>
          <Picker selectedValue={pais} onValueChange={(itemValue) => setPais(itemValue)}>
            {['Argentina', 'Chile', 'Uruguay', 'Brasil', 'Bolivia', 'Colombia', 'Ecuador', 'Paraguay',
              'Perú', 'Venezuela', 'México', 'Costa Rica', 'Cuba', 'Dominicana', 'El Salvador',
              'Guatemala', 'Honduras', 'Nicaragua', 'Panamá', 'Puerto Rico'
            ].map((p) => (
              <Picker.Item key={p} label={p} value={p} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.label}>Me desempeño como</Text>
      <View style={styles.roleContainer}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleButton, rol === r && styles.selected]}
            onPress={() => setRol(r)}
          >
            <Text style={[styles.roleText, rol === r ? { color: '#fff' } : { color: '#000' }]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Elegí un ícono</Text>
      <View style={styles.gradIconContainer}>
        <View style={styles.iconRow}>
          {firstRowIcons.map((icon, index) => {
            const isSelected = iconoSeleccionado === index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.gradIconButton, isSelected && styles.selected]}
                onPress={() => setIconoSeleccionado(index)}
              >
                <Image source={icon} style={styles.gradIcon} />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.iconRow}>
          {secondRowIcons.map((icon, index) => {
            const realIndex = index + 6;
            const isSelected = iconoSeleccionado === realIndex;
            return (
              <TouchableOpacity
                key={realIndex}
                style={[styles.gradIconButton, isSelected && styles.selected]}
                onPress={() => setIconoSeleccionado(realIndex)}
              >
                <Image source={icon} style={styles.gradIcon} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {iconoSeleccionado === 10 && (
        <>
          <Text style={styles.label}>Mi graduación es</Text>
          <View style={styles.gradContainer}>
            <View style={styles.row}>
              {graduaciones.slice(0, 3).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradButton, graduacion === g && styles.selected]}
                  onPress={() => setGraduacion(g)}
                >
                  <Text style={[styles.gradText, graduacion === g ? { color: '#fff' } : { color: '#000' }]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.row}>
              {graduaciones.slice(3).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradButton, graduacion === g && styles.selected]}
                  onPress={() => setGraduacion(g)}
                >
                  <Text style={[styles.gradText, graduacion === g ? { color: '#fff' } : { color: '#000' }]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {mensaje && (
        <View style={[styles.messageBox, mensaje.tipo === 'error' ? styles.errorBox : styles.successBox]}>
          <Text style={[styles.messageText, mensaje.tipo === 'error' ? styles.errorText : styles.successText]}>
            {mensaje.texto}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  gradContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    margin: 4,
  },
  gradButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    backgroundColor: '#fff',
    margin: 4,
  },
  selected: {
    backgroundColor: '#000',
  },
  roleText: {
    fontSize: 14,
  },
  gradText: {
    fontSize: 13,
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
  messageBox: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: '#721c24',
  },
  successText: {
    color: '#155724',
  },
  gradIconContainer: {
    marginBottom: 12,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gradIconButton: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    padding: 6,
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  gradIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default PerfilEditScreen;
