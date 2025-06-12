import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Header from '../components/header';
import Footer from '../components/footer';

const gradoIcons = [
  { id: 'gup1', image: require('../assets/images/Frame 427318971.jpg'), label: 'Gup 1' },
  { id: 'gup2', image: require('../assets/images/Group 8999.jpg'), label: 'Gup 2' },
  { id: 'gup3', image: require('../assets/images/Group 8998.jpg'), label: 'Gup 3' },
  { id: 'gup4', image: require('../assets/images/Group 9000 (3).jpg'), label: 'Gup 4' },
  { id: 'gup5', image: require('../assets/images/Group 9001.jpg'), label: 'Gup 5' },
  { id: 'gup6', image: require('../assets/images/Group 9002.jpg'), label: 'Gup 6' },
  { id: 'dan1_3', image: require('../assets/images/Frame 427318974.jpg'), label: 'I a III Dan' },
  { id: 'dan1_3_2', image: require('../assets/images/Group 9004.jpg'), label: 'I a III Dan' },
  { id: 'dan4_6', image: require('../assets/images/Group 9005.jpg'), label: 'IV a VI Dan' },
  { id: 'dan4_6_2', image: require('../assets/images/Group 9006.jpg'), label: 'IV a VI Dan' },
  { id: 'dan4_6_3', image: require('../assets/images/Group 9007.jpg'), label: 'IV a VI Dan' },
];

const graduacionIcons = gradoIcons; // Usa los mismos íconos

export default function ConfirmRegister() {
  const [pais, setPais] = useState('Argentina');
  const [rol, setRol] = useState('Instructor');
  const [esInstructorMayor, setEsInstructorMayor] = useState(false);
  const [nombreInstructorMayor, setNombreInstructorMayor] = useState('');
  const [gradoActual, setGradoActual] = useState(null);
  const [graduacion, setGraduacion] = useState(null);
  const [edad, setEdad] = useState('');
  const [dojang, setDojang] = useState(null); // 👈 Nuevo estado

  const handleFinalRegister = () => {
    console.log({
      pais,
      rol,
      esInstructorMayor,
      nombreInstructorMayor,
      gradoActual,
      graduacion,
      dojang, // 👈 Agregado al registro
      edad,
    });
  };

  const renderIcons = (items, selectedId, setSelected) => (
    <View style={styles.iconGrid}>
      {items.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => setSelected(item.id)}>
          <Image
            source={item.image}
            style={[
              styles.iconImage,
              selectedId === item.id && styles.iconSelected,
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Image
          source={require('../assets/images/TaeKwonDo.jpg')}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.title}>Registrate</Text>

        <Text style={styles.label}>País</Text>
        <TextInput
          style={styles.input}
          value={pais}
          onChangeText={setPais}
          placeholder="Argentina"
        />
        <Text style={styles.subLabel}>Elige tu país de residencia</Text>

        <Text style={styles.label}>Me desempeño como</Text>
        <View style={styles.buttonGroup}>
          {['Instructor', 'Practicante', 'Padre/Madre'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.rolBtn, rol === item && styles.selectedBtn]}
              onPress={() => setRol(item)}
            >
              <Text style={[styles.rolText, rol === item && styles.selectedText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Selecciona tu grado actual</Text>
        {renderIcons(gradoIcons, gradoActual, setGradoActual)}

        <Text style={styles.label}>¿Eres el Instructor Mayor?</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.rolBtn, esInstructorMayor && styles.selectedBtn]}
            onPress={() => setEsInstructorMayor(true)}
          >
            <Text style={[styles.rolText, esInstructorMayor && styles.selectedText]}>SÍ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rolBtn, !esInstructorMayor && styles.selectedBtn]}
            onPress={() => setEsInstructorMayor(false)}
          >
            <Text style={[styles.rolText, !esInstructorMayor && styles.selectedText]}>NO</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>¿Nombre del Instructor Mayor?</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Instructor mayor"
          value={nombreInstructorMayor}
          onChangeText={setNombreInstructorMayor}
        />

        <Text style={styles.label}>Mi graduación es</Text>
        {renderIcons(graduacionIcons, graduacion, setGraduacion)}

        {/* ✅ Botones de Dojang */}
        <Text style={styles.label}>Dojang</Text>
        <View style={styles.buttonGroup}>
          {['Dojang 1', 'Dojang 2', 'Dojang 3', 'Dojang 4','Dojang 5','Dojang 6',].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.rolBtn, dojang === item && styles.selectedBtn]}
              onPress={() => setDojang(item)}
            >
              <Text style={[styles.rolText, dojang === item && styles.selectedText]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="XX / XX / XXXX"
          value={edad}
          onChangeText={setEdad}
        />

        <TouchableOpacity style={styles.registerBtn} onPress={handleFinalRegister}>
          <Text style={styles.registerText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  subLabel: {
    alignSelf: 'flex-start',
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  rolBtn: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  rolText: {
    fontSize: 14,
    color: '#000',
  },
  selectedBtn: {
    backgroundColor: '#000',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
    gap: 10,
  },
  iconImage: {
    width: 50,
    height: 50,
    margin: 6,
    borderRadius: 10,
  },
  iconSelected: {
    borderWidth: 3,
    borderColor: '#000',
  },
  registerBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
