import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/header';

const COLORS = [
  { label: '⚪ Blanco', value: '⚪' },
  { label: '🟡 Amarillo', value: '🟡' },
  { label: '🟢 Verde', value: '🟢' },
  { label: '🔵 Azul', value: '🔵' },
  { label: '🔴 Rojo', value: '🔴' },
  { label: '⚫ Negro', value: '⚫' },
];

const MOVIMIENTOS = [
  { label: 'Movimiento 1', value: 'mov1' },
  { label: 'Movimiento 2', value: 'mov2' },
];

function CustomDropdown({ placeholder, data, selectedValue, onValueChange }) {
  const [open, setOpen] = useState(false);
  const selectedItem = data.find(item => item.value === selectedValue);
  const displayLabel = selectedItem ? selectedItem.label : placeholder;

  return (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownText, !selectedItem && styles.placeholderText]}>
          {displayLabel}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#999" style={{ marginRight: 12 }} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <FlatList
            data={data}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onValueChange(item.value);
                  setOpen(false);
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

export default function EditarTuls() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [nombreTul, setNombreTul] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [movimientos, setMovimientos] = useState('');
  const [colorInicial, setColorInicial] = useState(null);
  const [colorFinal, setColorFinal] = useState(null);
  const [movimientoEditar, setMovimientoEditar] = useState(null);
  const [contenido, setContenido] = useState('PRO');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error('No hay ID válido para el tul');
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/auth/tules/${id}`)
      .then(res => res.json())
      .then(data => {
        setNombreTul(data.nombre || '');
        setDescripcion(data.descripcion || '');
        setMovimientos(data.movimientos?.toString() || '');
        setColorInicial(data.colorInicial || null);
        setColorFinal(data.colorFinal || null);
        setContenido(data.contenido || 'PRO');
        setMovimientoEditar(data.movimientoEditar || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar tul:', err);
        setLoading(false);
      });
  }, [id]);

  const handleGuardarCambios = async () => {
    if (!id) return;

    const formData = new FormData();
    formData.append("nombre", nombreTul || "");
    formData.append("descripcion", descripcion || "");
    formData.append("movimientos", movimientos || "");
    formData.append("colorInicial", colorInicial || "");
    formData.append("colorFinal", colorFinal || "");
    formData.append("plan", contenido || "");
    formData.append("movimientoEditar", movimientoEditar || "");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/tules/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Cambios guardados correctamente");
      } else {
        console.error("❌ Error en la respuesta:", data);
        alert("Error al guardar cambios.");
      }
    } catch (error) {
      console.error("❌ Error de red o del servidor:", error);
      alert("Error de red o del servidor.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Cargando datos del tul...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <Text style={styles.title}>Editar tuls</Text>
      <Text style={styles.debugText}>ID recibido: {id || 'No recibido'}</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombreTul}
        onChangeText={setNombreTul}
        placeholder="Nombre del tul"
      />

      <Text style={styles.label}>Color inicial:</Text>
      <CustomDropdown
        placeholder="Color inicial"
        data={COLORS}
        selectedValue={colorInicial}
        onValueChange={setColorInicial}
      />

      <Text style={styles.label}>Color final:</Text>
      <CustomDropdown
        placeholder="Color final"
        data={COLORS}
        selectedValue={colorFinal}
        onValueChange={setColorFinal}
      />

      <Text style={styles.label}>Cantidad de movimientos:</Text>
      <TextInput
        style={styles.input}
        value={movimientos}
        onChangeText={setMovimientos}
        placeholder="Cantidad de movimientos"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.textArea}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        multiline
      />

      <Text style={styles.label}>Selecciona un movimiento a editar</Text>
      <CustomDropdown
        placeholder="Selecciona un movimiento a editar"
        data={MOVIMIENTOS}
        selectedValue={movimientoEditar}
        onValueChange={setMovimientoEditar}
      />

      <Text style={styles.label}>Contenido:</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBtn, contenido === 'PRO' && styles.toggleBtnActive]}
          onPress={() => setContenido('PRO')}
        >
          <Text style={[styles.toggleText, contenido === 'PRO' && styles.toggleTextActive]}>PRO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, contenido === 'BASICO' && styles.toggleBtnActive]}
          onPress={() => setContenido('BASICO')}
        >
          <Text style={[styles.toggleText, contenido === 'BASICO' && styles.toggleTextActive]}>BASICO</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.blackBtn} onPress={handleGuardarCambios}>
        <Text style={styles.blackBtnText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.blackBtn} onPress={() => navigation.navigate('editarteoria', { id })}>
        <Text style={styles.blackBtnText}>Editar Teoría</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.whiteBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.whiteBtnText}>Cancelar</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Thinking with <Text style={{ fontWeight: '600' }}>Mindcircus Agency.</Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16 },
  debugText: { fontSize: 12, color: '#666', marginBottom: 8 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '400' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16 },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dropdownText: { fontSize: 16 },
  placeholderText: { color: '#aaa' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '50%',
  },
  option: { paddingVertical: 10 },
  optionText: { fontSize: 16 },
  toggleContainer: { flexDirection: 'row', marginBottom: 20 },
  toggleBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  toggleBtnActive: { backgroundColor: '#000' },
  toggleText: { textAlign: 'center', color: '#000' },
  toggleTextActive: { color: '#fff' },
  blackBtn: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  blackBtnText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  whiteBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  whiteBtnText: { color: '#000', textAlign: 'center', fontWeight: '600' },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 12, color: '#888' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePickerArea: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  imageName: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    borderRadius: 4,
  },
});
